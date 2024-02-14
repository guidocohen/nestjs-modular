import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { transformSchema } from '../../common/transform-schema/transform-schema';

@Schema({ timestamps: true, toJSON: { transform: transformSchema } })
export class Category extends Document {
  @Prop({ required: true, type: String })
  name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
