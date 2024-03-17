import { Module } from "@nestjs/common";
import { OrdersService } from "./services";
import { OrdersController } from "./controllers";
import { ProductsModule } from "../products/products.module";

@Module({
  imports: [ProductsModule],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
