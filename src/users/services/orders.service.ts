import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Order } from '../entities/order.entity';
import { CreateOrderDto, UpdateOrderDto } from '../dtos/order.dto';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async findAll() {
    return await this.orderModel.find().exec();
  }

  async findOne(id: string) {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return order;
  }

  async create(data: CreateOrderDto) {
    const newOrder = await this.orderModel.create(data);
    return newOrder;
  }

  async update(id: string, changes: UpdateOrderDto) {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();
    if (!updatedOrder) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return updatedOrder;
  }

  async remove(id: string) {
    const order = await this.orderModel.findByIdAndDelete(id);
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return true;
  }
}
