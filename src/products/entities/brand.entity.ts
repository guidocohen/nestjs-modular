import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema() // TODO: Agregar { timestamps: true }) y agregar campos createdAt y updatedAt
export class Brand extends Document {
  @Prop({ required: true, unique: true, type: String })
  name: string;
  @Prop({ type: String })
  image: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
