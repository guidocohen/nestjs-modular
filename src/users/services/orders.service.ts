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
import { Product } from '../../products/entities/product.entity';
import { ProductsService } from '../../products/services/products.service';

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

  async calculateTotalPrice(stringProducts) {
    const dbProducts = await this.productService.findByIds(stringProducts);
    if (dbProducts.length < stringProducts.length) {
      throw new NotFoundException('One or more products not found');
    }

    const totalPrice = dbProducts.reduce((c, prod) => c + prod.price, 0);
    return totalPrice;
  }

  async create(data: CreateOrderDto) {
    const totalPrice = await this.calculateTotalPrice(data.products);
    const newOrder = await this.orderModel.create({
      ...data,
      totalPrice,
    });
    return newOrder;
  }

  async update(id: string, changes: UpdateOrderDto) {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, { $set: { ...changes } }, { new: true })
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

  // TODO: Validate if products exists & implement quantity
  async addProducts(orderId: string, productIds: string[]) {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order #${orderId} not found`);
    }

    const products = Array.from(new Set([...order.products, ...productIds]));
    if (products.length === order.products.length) {
      throw new NotFoundException('The products are already in the order');
    }
    const totalPrice = await this.calculateTotalPrice(products);

    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(
        orderId,
        {
          $set: {
            products,
            totalPrice,
          },
        },
        { new: true },
      )
      .populate('customer')
      .populate({
        path: 'products',
        model: Product.name,
      });
    return updatedOrder;
  }

  /*
  async addProducts(orderId: string, productIds: string[]) {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order #${orderId} not found`);
    }

    const products = await this.productService.findByIds(productIds);
    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products not found');
    }

    products.forEach((product) => {
      const existingProduct = order.products.find(
        (p) => p.productId === product._id.toString(),
      );
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        order.products.push({ productId: product._id.toString(), quantity: 1 });
      }
    });

    const totalPrice = await this.calculateTotalPrice(
      order.products.map((p) => p.productId),
    );

    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(
        orderId,
        {
          $set: {
            products: order.products,
            totalPrice,
          },
        },
        { new: true },
      )
      .populate('customer')
      .populate({
        path: 'products.productId',
        model: Product.name,
      });

    return updatedOrder;
  }
  */

  async remove(id: string) {
    const order = await this.orderModel.findByIdAndDelete(id);
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return true;
  }

  async removeProduct(orderId: string, productId: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order #${orderId} not found`);
    }
    order.products.pull(productId);
    const totalPrice = await this.calculateTotalPrice(order.products);

    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(
        orderId,
        {
          $set: {
            products: order.products,
            totalPrice,
          },
        },
        { new: true },
      )
      .populate('customer')
      .populate({
        path: 'products',
        model: Product.name,
      });

    return updatedOrder;
  }
}
