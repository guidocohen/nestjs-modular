import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { OrdersService } from '../services/orders.service';
import {
  AddProductsDto,
  CreateOrderDto,
  UpdateOrderDto,
} from '../dtos/order.dto';
import { MongoIdPipe } from '../../common/mongo-id/mongo-id.pipe';
import { JwtAuthGuard } from '../../auth/guards/jwt.auth.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  get(@Param('id', MongoIdPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateOrderDto) {
    return this.ordersService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() payload: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, payload);
  }

  @Put(':orderId/products')
  addProducts(
    @Param('orderId', MongoIdPipe) orderId: string,
    @Body() payload: AddProductsDto,
  ) {
    return this.ordersService.addProducts(orderId, payload.productIds);
  }

  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.ordersService.remove(id);
  }

  @Delete(':orderId/products/:productId')
  removeProduct(
    @Param('orderId', MongoIdPipe) orderId: string,
    @Param('productId', MongoIdPipe) productId: string,
  ) {
    return this.ordersService.removeProduct(orderId, productId);
  }
}
