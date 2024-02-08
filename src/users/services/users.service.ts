import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll() {
    return await this.userModel.find().exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async create(data: CreateUserDto) {
    const newUser = await this.userModel.create(data);
    return newUser;
  }

  async update(id: string, changes: UpdateUserDto) {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return updatedUser;
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return true;
  }

  async getOrdersByUser(id: string) {
    const user = await this.userModel.findById(id).populate('orders').exec();
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }
}
