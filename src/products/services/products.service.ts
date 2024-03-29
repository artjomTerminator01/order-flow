import { Injectable } from "@nestjs/common";
import { ProductDTO } from "../dtos";
import { Product } from "../interfaces";

@Injectable()
export class ProductsService {
  private products: Product[] = [
    { id: 123, name: "Ketchup", price: "0.45" },
    { id: 456, name: "Beer", price: "2.33" },
    { id: 879, name: "Õllesnäkk", price: "0.42" },
    { id: 999, name: '75" OLED TV', price: "1333.37" },
  ];

  getAllProducts(): ProductDTO[] {
    return this.products;
  }

  getProductById(productId: number): Product | null {
    return this.products.find((product) => product.id === productId);
  }
}
