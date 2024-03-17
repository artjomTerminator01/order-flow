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
import { OrderService } from "../services/order.service";

@Controller("api/orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createOrder(): OrderDTO {
    return this.orderService.createOrder();
  }

  @Get(":orderId")
  getOrderById(@Param("orderId") orderId: string): OrderDTO {
    return this.orderService.getOrderById(orderId);
  }

  @Patch(":orderId")
  updateOrderStatus(
    @Param("orderId") orderId: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto
  ): string {
    return this.orderService.updateOrderStatus(
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
    return this.orderService.addProductToOrder(orderId, productIds);
  }

  @Get(":orderId/products")
  getOrderProducts(
    @Param("orderId") orderId: string
  ): OrderProductDTO[] | string {
    return this.orderService.getOrderProducts(orderId);
  }

  @Patch(":orderId/products/:productId")
  updateOrderProduct(
    @Param("orderId") orderId: string,
    @Param("productId") productId: string,
    @Body() updateOrderProductDto: UpdateOrderProductDto
  ): string {
    return this.orderService.updateOrderProduct(
      orderId,
      productId,
      updateOrderProductDto
    );
  }
}
