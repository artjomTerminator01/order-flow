import { Injectable } from "@nestjs/common";
import { Order, OrderProduct } from "../interfaces";
import { v4 as uuidv4 } from "uuid";
import { ProductService } from "../../product/services/product.service";

@Injectable()
export class OrderService {
  public constructor(private readonly productsService: ProductService) {}

  private orders: Order[] = [];
  private newOrder: Order = {
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

  createOrder(): Order {
    const newOrder: Order = this.newOrder;
    this.orders.push(newOrder);
    return newOrder;
  }

  getOrderById(orderId: string): Order | string {
    const order = this.orders.find((order) => order.id === orderId);
    if (!order) return "Not found";
    return order;
  }

  updateOrderStatus(orderId: string, status: string): Order | string {
    const order = this.orders.find((order) => order.id === orderId);
    if (order) {
      if (order.status.toLowerCase() === "paid")
        order.amount.paid = order.amount.total;
      order.status = status;
      return order;
    }
    //f96d1fa8-ca78-4bcf-a664-f8a58e01bc10
    // invalid order status
    //check response
    return "Not found";
  }

  addProductToOrder(
    orderId: string,
    productIds: number[]
  ): OrderProduct[] | string {
    const order = this.orders.find((order) => order.id === orderId);
    if (!order) return "Not found";

    const hasDuplicates = new Set(productIds).size !== productIds.length;
    if (order.status.toLowerCase() === "paid" || hasDuplicates)
      return "Invalid parameters";

    // Check if all products exist before adding any to the order
    const allProductsExist = productIds.every(
      (id) => this.productsService.getProductById(id) !== undefined
    );

    if (!allProductsExist) {
      return "Invalid parameters";
    }

    productIds.forEach((id) => {
      const product = this.productsService.getProductById(id); // This check is now redundant but kept for safety

      const existingProductIndex = order.products.findIndex(
        (op) => op.product_id === id
      );

      if (existingProductIndex > -1) {
        order.products[existingProductIndex].quantity += 1;
      } else {
        order.products.push({
          id: uuidv4(),
          name: product.name,
          price: product.price,
          product_id: product.id,
          quantity: 1,
          replaced_with: null,
        });
      }
    });

    return order.products;
  }

  getOrderProducts(orderId: string): OrderProduct[] | string {
    const order = this.orders.find((order) => order.id === orderId);
    if (!order) return "Not found";
    return order.products;
  }

  updateOrderProduct(
    orderId: string,
    productId: string,
    body:
      | { quantity: number }
      | {
          replaced_with: {
            product_id: number;
            quantity: number;
          };
        }
  ): Order | string {
    if ("quantity" in body) {
      return this.updateProductQuantity(orderId, productId, body.quantity);
    } else if ("replaced_with" in body) {
      const { product_id, quantity } = body.replaced_with;
      return this.addReplacementProduct(
        orderId,
        productId,
        product_id,
        quantity
      );
    }
    return "Invalid parameters";
  }

  updateProductQuantity(
    orderId: string,
    productId: string,
    quantity: number
  ): Order | string {
    const order = this.orders.find((order) => order.id === orderId);

    if (order) {
      const productIndex = order.products.findIndex((p) => p.id === productId);
      if (productIndex > -1) {
        order.products[productIndex].quantity = quantity;
        return order;
      }
    }

    return "Not found";
  }

  addReplacementProduct(
    orderId: string,
    productId: string,
    replacementProductId: number,
    replacementQuantity: number
  ): Order | string {
    const order = this.orders.find((order) => order.id === orderId);
    if (!order) return "Not found";
    if (order.status.toLowerCase() !== "paid") return "Invalid parameters";
    //handle errors

    const productIndex = order.products.findIndex(
      (product) => product.id === productId
    );
    if (productIndex === -1) return "Not found";

    const replacementProductDetails =
      this.productsService.getProductById(replacementProductId);
    if (!replacementProductDetails) return "Not found";

    const replacementProduct =
      this.productsService.getProductById(replacementProductId);

    order.products[productIndex].replaced_with = {
      id: uuidv4(),
      name: replacementProduct.name,
      price: replacementProduct.price,
      product_id: replacementProduct.id,
      quantity: replacementQuantity,
      replaced_with: null,
    };

    return order;
  }
}
