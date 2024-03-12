import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Order, OrderProduct } from '../interfaces';
import { OrderService } from '../services/order.service';

@Controller('api/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(): Order {
    return this.orderService.createOrder();
  }

  @Get(':orderId')
  getOrderById(@Param('orderId') orderId: string): Order | string {
    return this.orderService.getOrderById(orderId);
  }

  @Patch(':orderId')
  updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body() body: { status: string },
  ): Order | string {
    return this.orderService.updateOrderStatus(orderId, body.status);
  }

  @Post(':orderId/products')
  addProductToOrder(
    @Param('orderId') orderId: string,
    @Body() body: number[],
  ): OrderProduct[] | string {
    console.log(body);
    return this.orderService.addProductToOrder(orderId, body);
  }

  @Get(':orderId/products')
  getOrderProducts(@Param('orderId') orderId: string): OrderProduct[] | string {
    return this.orderService.getOrderProducts(orderId);
  }

  // @Patch(':orderId/products/:productId')
  // updateProductQuantity(
  //   @Param('orderId') orderId: string,
  //   @Param('productId') productId: number,
  //   @Body() body: { quantity: number },
  // ): Order | undefined {
  //   return this.orderService.updateProductQuantity(
  //     orderId,
  //     productId,
  //     body.quantity,
  //   );
  // }

  // @Patch(':orderId/products/:productId')
  // replaceOrderProduct(
  //   @Param('orderId') orderId: string,
  //   @Param('productId') productId: string,
  //   @Body()
  //   replaceProductDto: {
  //     replaced_with: { product_id: number; quantity: number };
  //   },
  // ): Order | undefined {
  //   return this.orderService.addReplacementProduct(
  //     orderId,
  //     productId,
  //     replaceProductDto.replaced_with.product_id,
  //     replaceProductDto.replaced_with.quantity,
  //   );
  // }

  @Patch(':orderId/products/:productId')
  updateOrderProduct(
    @Param('orderId') orderId: string,
    @Param('productId') productId: string,
    @Body()
    body:
      | { quantity: number }
      | {
          replaced_with: {
            product_id: number;
            quantity: number;
          };
        },
  ): Order | string {
    console.log(body);
    return this.orderService.updateOrderProduct(orderId, productId, body);
  }
}
