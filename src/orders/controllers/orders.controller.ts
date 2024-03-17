import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import {
  OrderDTO,
  OrderProductDTO,
  UpdateOrderProductDto,
  UpdateOrderStatusDto,
} from "../dtos";
import { OrdersService } from "../services/orders.service";

@Controller("api/orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createOrder(): OrderDTO {
    return this.ordersService.createOrder();
  }

  @Get(":orderId")
  getOrderById(@Param("orderId") orderId: string): OrderDTO {
    return this.ordersService.getOrderById(orderId);
  }

  @Patch(":orderId")
  updateOrderStatus(
    @Param("orderId") orderId: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto
  ): string {
    return this.ordersService.updateOrderStatus(
      orderId,
      updateOrderStatusDto.status
    );
  }

  @Post(":orderId/products")
  @HttpCode(HttpStatus.CREATED)
  addProductToOrder(
    @Param("orderId") orderId: string,
    @Body() productIds: number[]
  ): string {
    return this.ordersService.addProductToOrder(orderId, productIds);
  }

  @Get(":orderId/products")
  getOrderProducts(
    @Param("orderId") orderId: string
  ): OrderProductDTO[] | string {
    return this.ordersService.getOrderProducts(orderId);
  }

  @Patch(":orderId/products/:productId")
  updateOrderProduct(
    @Param("orderId") orderId: string,
    @Param("productId") productId: string,
    @Body() updateOrderProductDto: UpdateOrderProductDto
  ): string {
    return this.ordersService.updateOrderProduct(
      orderId,
      productId,
      updateOrderProductDto
    );
  }
}
