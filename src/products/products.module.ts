import { Module } from "@nestjs/common";
import { ProductsService } from "./services";
import { ProductsController } from "./controllers";

@Module({
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
