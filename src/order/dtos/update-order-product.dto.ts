import { IsInt, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class ReplacedWith {
  @IsInt()
  product_id: number;

  @IsInt()
  quantity: number;
}

export class UpdateOrderProductDto {
  @IsInt()
  @IsOptional()
  quantity?: number;

  @ValidateNested()
  @Type(() => ReplacedWith)
  @IsOptional()
  replaced_with?: ReplacedWith;
}
