import { IsArray, IsNumber } from "class-validator";

export class CreateOrderProductDto {
  @IsArray()
  @IsNumber({}, { each: true })
  productIds: number[];
}
