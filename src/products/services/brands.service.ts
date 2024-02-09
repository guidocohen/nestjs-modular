import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Brand } from '../entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dto';

@Injectable()
export class BrandsService {
  constructor(@InjectModel(Brand.name) private brandModel: Model<Brand>) {}

  async findAll() {
    return await this.brandModel.find().exec();
  }

  async findOne(id: string) {
    const brand = await this.brandModel.findById(id).exec();
    if (!brand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }
    return brand;
  }

  async create(data: CreateBrandDto) {
    try {
      const brand = await this.brandModel.findOne({ name: data.name }).exec();
      if (brand) {
        throw new Error(`Brand ${data.name} already exists`);
      }
      const newBrand = await this.brandModel.create(data);
      return newBrand;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async update(id: string, changes: UpdateBrandDto) {
    const updatedBrand = await this.brandModel
      .findByIdAndUpdate(id, changes, { new: true })
      .exec();
    // new: true returns the updated document
    // set: changes updates the fields that are in the changes object
    if (!updatedBrand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }
    return updatedBrand;
  }

  async remove(id: string) {
    const brand = await this.brandModel.findByIdAndDelete(id).exec();
    if (!brand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }
    return true;
  }
}
