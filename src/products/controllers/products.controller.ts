import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  CreateProductDto,
  FilterProductsDto,
  UpdateProductDto,
} from '../dtos/products.dto';
import { ProductsService } from './../services/products.service';
import { MongoIdPipe } from '../../common/mongo-id/mongo-id.pipe';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/models/roles.model';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List of products' })
  findAll(@Query() params: FilterProductsDto) {
    return this.productsService.findAll(params);
  }

  @Public()
  @Get(':productId')
  @HttpCode(HttpStatus.ACCEPTED)
  getOne(@Param('productId', MongoIdPipe) productId: string) {
    return this.productsService.findOne(productId);
  }

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() payload: CreateProductDto) {
    return this.productsService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: UpdateProductDto,
  ) {
    return this.productsService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id', MongoIdPipe) id: string) {
    return this.productsService.remove(id);
  }
}
