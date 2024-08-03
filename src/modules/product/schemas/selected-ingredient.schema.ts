import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class SelectedIngredient {
  @Prop({ required: true })
  ingredientId: string;

  @Prop({ required: true })
  qty: number;
}