import { OrderProduct } from "../interfaces";

export class OrderProductDTO {
  id: string;
  name: string;
  price: string;
  quantity: number;
  product_id: number;
  replaced_with: OrderProductDTO | null;

  constructor(orderProduct: OrderProduct) {
    this.id = orderProduct.id;
    this.name = orderProduct.name;
    this.price = orderProduct.price;
    this.quantity = orderProduct.quantity;
    this.product_id = orderProduct.product_id;
    this.replaced_with = orderProduct.replaced_with
      ? new OrderProductDTO(orderProduct.replaced_with)
      : null;
  }
}
