import { Module } from '@nestjs/common';
import { ProductService } from './services';
import { ProductController } from './controllers';

@Module({
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
