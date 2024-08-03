import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Unit } from '../enums/unit.enum';

@Schema()
export class Ingredient {
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: Object.values(Unit) })
  unit: Unit;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  qty: number;

  static collectionName = 'ingredients';
}

export const IngredientSchema = SchemaFactory.createForClass(Ingredient);
