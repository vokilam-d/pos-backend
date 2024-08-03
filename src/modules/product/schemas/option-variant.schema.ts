import { Prop, Schema } from '@nestjs/mongoose';
import { SelectedOption } from './selected-option.schema';
import { SelectedIngredient } from './selected-ingredient.schema';

@Schema()
export class OptionVariant {
  @Prop({ type: [SelectedOption], default: [] })
  selectedOptions: SelectedOption[];

  @Prop({ type: [SelectedIngredient], default: [] })
  ingredients: SelectedIngredient[];

  @Prop({ default: 0 })
  primeCost: number;

  @Prop({ default: 0 })
  markupPercent: number;

  @Prop({ default: 0 })
  price: number;
}