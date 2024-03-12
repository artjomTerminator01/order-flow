import { Controller, Get } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { Product } from '../interfaces';

@Controller('api/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAllProducts(): Product[] {
    return this.productService.getAllProducts();
  }
}
