import { Controller, Get } from "@nestjs/common";
import { ProductsService } from "../services/products.service";
import { ProductDTO } from "../dtos";

@Controller("api/products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts(): ProductDTO[] {
    return this.productsService.getAllProducts();
  }
}
