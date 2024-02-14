import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Customer } from './customer.entity';
import { Product } from '../../products/entities/product.entity';
import { transformSchema } from '../../common/transform-schema/transform-schema';

@Schema({ timestamps: true, toJSON: { transform: transformSchema } })
export class Order extends Document {
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
