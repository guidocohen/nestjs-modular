import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { transformSchema } from '../../common/transform-schema/transform-schema';
import { Customer } from './customer.entity';

@Schema({ timestamps: true, toJSON: { transform: transformSchema } })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true })
  role: string;

  @Prop({ type: Types.ObjectId, ref: Customer.name })
  customer: Customer | Types.ObjectId; // 1:1 relationship ref
}

export const UserSchema = SchemaFactory.createForClass(User);
