import { Module } from "@nestjs/common";
import { OrdersService } from "./services";
import { OrdersController } from "./controllers";
import { ProductModule } from "../product/product.module";

@Module({
  imports: [ProductModule],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrderModule {}
