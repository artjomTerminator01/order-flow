import { Controller, Get } from "@nestjs/common";
import { ProductService } from "../services/product.service";
import { ProductDTO } from "../dtos";

@Controller("api/products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAllProducts(): ProductDTO[] {
    return this.productService.getAllProducts();
  }
}
