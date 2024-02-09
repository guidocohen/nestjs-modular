import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Order } from '../entities/order.entity';
import { CreateOrderDto, UpdateOrderDto } from '../dtos/order.dto';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/services/products.service';
import { Brand } from 'src/products/entities/brand.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @Inject(forwardRef(() => ProductsService))
    private readonly productService: ProductsService,
  ) {}

  async findAll() {
    return await this.orderModel.find().populate('customer').populate({
      path: 'products',
      model: Product.name,
    });
  }

  async findOne(id: string) {
    const order = await this.orderModel
      .findById(id)
      .populate('customer')
      .populate({
        path: 'products',
        model: Product.name,
      });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return order;
  }

  async calculateTotalPrice(data: CreateOrderDto): Promise<number> {
    const products = await this.productService.findByIds(data.products);
    if (products.length !== data.products.length) {
      throw new NotFoundException('One or more products not found');
    }

    const totalPrice = products.reduce((c, prod) => c + prod.price, 0);
    return totalPrice;
  }

  async create(data: CreateOrderDto) {
    const totalPrice = await this.calculateTotalPrice(data);
    const newOrder = await this.orderModel.create({
      ...data,
      totalPrice,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return newOrder;
  }

  async update(id: string, changes: UpdateOrderDto) {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(
        id,
        { $set: { ...changes, updatedAt: new Date() } },
        { new: true },
      )
      .populate('customer')
      .populate({
        path: 'products',
        model: Product.name,
      });
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
