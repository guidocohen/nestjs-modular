import {
  IsMongoId,
  IsNotEmpty,
  IsDate,
  IsArray,
  IsOptional,
  IsIn,
} from 'class-validator';
import { OmitType, PartialType } from '@nestjs/swagger';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly customer: string;

  @IsDate()
  @IsOptional()
  readonly createdAt: Date;

  @IsDate()
  @IsOptional()
  readonly updatedAt: Date;

  @IsArray()
  @IsNotEmpty()
  readonly products: string[];

  @IsNotEmpty()
  @IsIn(['pending', 'approved', 'declined'])
  readonly status: string = 'pending';

  @IsOptional()
  readonly totalPrice: number;
}

export class UpdateOrderDto extends PartialType(
  OmitType(CreateOrderDto, ['products']),
) {}

export class AddProductsDto {
  @IsArray()
  @IsNotEmpty()
  readonly productIds: string[];
}
