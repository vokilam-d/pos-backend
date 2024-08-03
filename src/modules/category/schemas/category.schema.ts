import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


@Schema()
export class Category {
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  photoUrl: string | null;

  @Prop({ required: true })
  sortOrder: number;

  static collectionName = 'categories';
}

export const CategorySchema = SchemaFactory.createForClass(Category);
