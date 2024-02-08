import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async findAll() {
    return await this.categoryModel.find().exec();
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return category;
  }

  async create(data: CreateCategoryDto) {
    const newCategory = await this.categoryModel.create(data);
    return newCategory;
  }

  async update(id: string, changes: UpdateCategoryDto) {
    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(id, changes, { new: true })
      .exec();
    // new: true returns the updated document
    // set: changes updates the fields that are in the changes object
    if (!updatedCategory) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return updatedCategory;
  }

  async remove(id: string) {
    const category = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return true;
  }
}
