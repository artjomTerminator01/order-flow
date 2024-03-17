import { Product } from "../interfaces";

export class ProductDTO {
  id: number;
  name: string;
  price: string;

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.price = product.price;
  }
}
