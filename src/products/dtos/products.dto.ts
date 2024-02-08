import {
  IsString,
  IsNumber,
  IsUrl,
  IsNotEmpty,
  IsPositive,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  readonly price: number;

  @IsNumber()
  @IsNotEmpty()
  readonly stock: number;

  @ApiProperty({ description: 'Valid URL of the product image' })
  @IsUrl()
  @IsNotEmpty()
  readonly image: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class FilterProductsDto {
  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @IsPositive()
  limit: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @Min(0)
  offset: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Min(0)
  minPrice: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPositive()
  maxPrice: number;
}
