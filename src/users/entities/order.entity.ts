import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Customer } from './customer.entity';
import { Product } from 'src/products/entities/product.entity';

@Schema()
export class Order extends Document {
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  // customer is a reference to another document
  @Prop({ type: Types.ObjectId, ref: Customer.name, required: true })
  customer: Customer | Types.ObjectId;

  // products is an array of references to another document
  @Prop({ type: [{ type: Types.ObjectId, ref: Product.name, required: true }] })
  products: Types.Array<Product>;

  @Prop({ type: String, required: true })
  status: string;

  // TODO: totalPrice should be calculated in BillingsService
  @Prop({ type: Number })
  totalPrice: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
