import { Module } from '@nestjs/common';
import { OrderService } from './services';
import { OrderController } from './controllers';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [ProductModule],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
