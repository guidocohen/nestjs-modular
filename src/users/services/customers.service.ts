import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}

  async findAll() {
    return await this.customerModel.find().exec();
  }

  async findOne(id: string) {
    const customer = await this.customerModel.findById(id);
    if (!customer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }
    return customer;
  }

  async create(data: CreateCustomerDto) {
    const newCustomer = await this.customerModel.create(data);
    return newCustomer;
  }

  async update(id: string, changes: UpdateCustomerDto) {
    const updatedCustomer = await this.customerModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();
    if (!updatedCustomer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }
    return updatedCustomer;
  }

  async remove(id: string) {
    const customer = await this.customerModel.findByIdAndDelete(id);
    if (!customer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }
    return true;
  }
}
