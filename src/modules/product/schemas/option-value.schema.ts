import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class OptionValue {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;
}
