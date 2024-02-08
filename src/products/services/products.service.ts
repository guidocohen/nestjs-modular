import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { Product } from './../entities/product.entity';
import {
  CreateProductDto,
  FilterProductsDto,
  UpdateProductDto,
} from './../dtos/products.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async findAll(params?: FilterProductsDto) {
    if (params) {
      const filters: FilterQuery<Product> = {};
      const { limit = 10, offset = 0 } = params;

      const { minPrice, maxPrice } = params;
      if (minPrice && maxPrice && minPrice > maxPrice) {
        throw new Error('minPrice must be less than or equal to maxPrice');
      }
      filters.price = {
        ...(minPrice ? { $gte: minPrice } : {}),
        ...(maxPrice ? { $lte: maxPrice } : {}),
      };

      // TODO: Add date filters

      const products = await this.productModel
        .find(filters)
        .skip(offset)
        .limit(limit)
        .exec();
      const filteredCount = products.length;
      const totalProducts = await this.productModel.countDocuments().exec();
      return { products, filteredCount, totalProducts };
    }
    const products = await this.productModel.find().exec();
    const totalProducts = await this.productModel.countDocuments().exec();
    return { products, totalProducts };
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async create(data: CreateProductDto) {
    const newProduct = await this.productModel.create(data);
    return newProduct;
  }

  async update(id: string, changes: UpdateProductDto) {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();
    // new: true returns the updated document
    // set: changes updates the fields that are in the changes object
    if (!updatedProduct) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return updatedProduct;
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id).exec();
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return true;
  }
}
