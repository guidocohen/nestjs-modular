import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Brand } from '../entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dto';

@Injectable()
export class BrandsService {
  constructor(@InjectModel(Brand.name) private brandModel: Model<Brand>) {}

  findAll() {
    return this.brandModel.find().exec();
  }

  async findOne(id: string) {
    const brand = await this.brandModel.findById(id).exec();
    if (!brand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }
    return brand;
  }

  create(data: CreateBrandDto) {
    const newBrand = new this.brandModel(data);
    return newBrand.save();
  }

  async update(id: string, changes: UpdateBrandDto) {
    const updatedBrand = await this.brandModel
      .findByIdAndUpdate(id, changes, { new: true })
      .exec();
    if (!updatedBrand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }
    return updatedBrand;
  }

  async remove(id: string) {
    const deletedBrand = await this.brandModel.findByIdAndDelete(id).exec();
    if (!deletedBrand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }
    return true;
  }
}
