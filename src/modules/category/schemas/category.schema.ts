import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


@Schema({ id: true })
export class Category {
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  photoUrl: string | null;

  @Prop({ required: true })
  sortOrder: number;

  static collectionName = 'categories';
}

export const CategorySchema = SchemaFactory.createForClass(Category);
