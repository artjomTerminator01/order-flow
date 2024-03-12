import { Injectable } from '@nestjs/common';
import { Product } from '../interfaces';

@Injectable()
export class ProductService {
  private products: Product[] = [
    { id: 123, name: 'Ketchup', price: '0.45' },
    { id: 456, name: 'Beer', price: '2.33' },
    { id: 879, name: 'Õllesnäkk', price: '0.42' },
    { id: 999, name: '75" OLED TV', price: '1333.37' },
  ];

  getAllProducts(): Product[] {
    return this.products;
  }

  getProductById(productId: number): Product | undefined {
    return this.products.find((product) => product.id === productId);
  }
}
