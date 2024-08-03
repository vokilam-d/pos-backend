import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class SelectedOption {
  @Prop({ required: true })
  optionId: string;

  @Prop({ required: true })
  optionValueId: string;
}