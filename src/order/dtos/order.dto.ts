import { Order } from "../interfaces";
import { OrderProductDTO } from "./order-product.dto";

export class OrderDTO {
  id: string;
  status: string;
  products: OrderProductDTO[];
  amount: {
    total: string;
    paid: string;
    discount: string;
    returns: string;
  };

  constructor(order: Order) {
    this.id = order.id;
    this.status = order.status;
    this.products = order.products.map(
      (product) => new OrderProductDTO(product)
    );
    this.amount = order.amount;
  }
}
