import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { transformSchema } from '../../common/transform-schema/transform-schema';

@Schema({ timestamps: true, toJSON: { transform: transformSchema } })
export class Brand extends Document {
  @Prop({ required: true, unique: true, type: String })
  name: string;

  @Prop({ type: String })
  image: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
