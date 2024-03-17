import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Order } from "../interfaces";
import { v4 as uuidv4 } from "uuid";
import { ProductService } from "../../product/services/product.service";
import { OrderDTO, OrderProductDTO, UpdateOrderProductDto } from "../dtos";

@Injectable()
export class OrderService {
  public constructor(private readonly productsService: ProductService) {}

  private orders: Order[] = [];

  public createOrder(): OrderDTO {
    const newOrder: Order = {
      amount: {
        discount: "0.00",
        paid: "0.00",
        returns: "0.00",
        total: "0.00",
      },
      id: uuidv4(),
      products: [],
      status: "NEW",
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  public getOrderById(orderId: string): OrderDTO {
    const order = this.orders.find((order) => order.id === orderId);
    if (!order)
      throw new HttpException("Invalid parameters", HttpStatus.BAD_REQUEST);
    return order;
  }

  public updateOrderStatus(orderId: string, status: string): string {
    const order = this.orders.find((order) => order.id === orderId);
    if (order) {
      if (order.status.toLowerCase() === "paid")
        throw new HttpException("Invalid order status", HttpStatus.BAD_REQUEST);
      if (status.toLowerCase() === "paid") {
        order.status = status;
        order.amount.paid = order.amount.total;
        return "OK";
      }
      throw new HttpException("Invalid order status", HttpStatus.BAD_REQUEST);
    }
    throw new HttpException("Not found", HttpStatus.NOT_FOUND);
  }

  public addProductToOrder(orderId: string, productIds: number[]): string {
    const order = this.orders.find((order) => order.id === orderId);
    if (!order) throw new HttpException("Not found", HttpStatus.NOT_FOUND);

    const hasDuplicates = new Set(productIds).size !== productIds.length;
    if (order.status.toLowerCase() === "paid" || hasDuplicates)
      throw new HttpException("Invalid order status", HttpStatus.BAD_REQUEST);

    const allProductsExist = productIds.every(
      (id) => this.productsService.getProductById(id) !== undefined
    );
    if (!allProductsExist)
      throw new HttpException("Invalid order status", HttpStatus.BAD_REQUEST);

    let total = +order.amount.total;
    productIds.forEach((id) => {
      const existingProductIndex = order.products.findIndex(
        (op) => op.product_id === id
      );

      if (existingProductIndex > -1) {
        order.products[existingProductIndex].quantity += 1;
      } else {
        const product = this.productsService.getProductById(id);
        order.products.push({
          id: uuidv4(),
          name: product.name,
          price: product.price,
          product_id: product.id,
          quantity: 1,
          replaced_with: null,
        });
        total += +product.price;
      }
    });

    order.amount.total = total.toString();
    return "OK";
  }

  public getOrderProducts(orderId: string): OrderProductDTO[] {
    const order = this.orders.find((order) => order.id === orderId);
    if (!order) throw new HttpException("Not found", HttpStatus.NOT_FOUND);
    return order.products;
  }

  public updateOrderProduct(
    orderId: string,
    productId: string,
    updateOrderProductDto: UpdateOrderProductDto
  ): string {
    if ("quantity" in updateOrderProductDto) {
      return this.updateProductQuantity(
        orderId,
        productId,
        updateOrderProductDto.quantity
      );
    } else if ("replaced_with" in updateOrderProductDto) {
      const { product_id, quantity } = updateOrderProductDto.replaced_with;
      return this.addReplacementProduct(
        orderId,
        productId,
        product_id,
        quantity
      );
    }
    throw new HttpException("Invalid order status", HttpStatus.BAD_REQUEST);
  }

  private updateProductQuantity(
    orderId: string,
    productId: string,
    quantity: number
  ): string {
    if (quantity < 0)
      throw new HttpException("Invalid parameters", HttpStatus.BAD_REQUEST);

    const order = this.orders.find((order) => order.id === orderId);

    if (order && order.status.toLowerCase() !== "paid") {
      const productIndex = order.products.findIndex((p) => p.id === productId);
      let total = +order.amount.total;

      if (productIndex > -1) {
        total +=
          quantity * +order.products[productIndex].price -
          order.products[productIndex].quantity *
            +order.products[productIndex].price;
        order.products[productIndex].quantity = quantity;
        order.amount.total = total.toString();
        return "OK";
      }
    }

    throw new HttpException("Not found", HttpStatus.NOT_FOUND);
  }

  private addReplacementProduct(
    orderId: string,
    productId: string,
    replacementProductId: number,
    replacementQuantity: number
  ): string {
    const order = this.orders.find((order) => order.id === orderId);
    if (!order) throw new HttpException("Not found", HttpStatus.NOT_FOUND);

    if (order.status.toLowerCase() !== "paid")
      throw new HttpException("Invalid order status", HttpStatus.BAD_REQUEST);

    const productIndex = order.products.findIndex(
      (product) => product.id === productId
    );
    if (productIndex === -1)
      throw new HttpException("Not found", HttpStatus.NOT_FOUND);

    const replacementProduct =
      this.productsService.getProductById(replacementProductId);
    if (!replacementProduct)
      throw new HttpException("Not found", HttpStatus.NOT_FOUND);

    order.products[productIndex].replaced_with = {
      id: uuidv4(),
      name: replacementProduct.name,
      price: replacementProduct.price,
      product_id: replacementProduct.id,
      quantity: replacementQuantity,
      replaced_with: null,
    };

    return "OK";
  }
}
