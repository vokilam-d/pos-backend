import { Prop, Schema } from '@nestjs/mongoose';
import { OptionValue } from './option-value.schema';

@Schema()
export class Option {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [OptionValue], default: [] })
  values: OptionValue[];
}
