import { TransformOptions } from 'class-transformer/types/interfaces';
import { Transform } from 'class-transformer';

export const TransformGetId = (toString: boolean = true, options?: TransformOptions): PropertyDecorator => {
  return Transform(
    ({ obj }) => {
      const _id = toString ? obj._id?.toString() : obj._id;
      return obj.id || _id;
    },
    options,
  );
}