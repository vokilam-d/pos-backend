import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Ingredient } from '../schemas/ingredient.schema';
import { CreateOrUpdateIngredientDto } from '../dtos/create-or-update-ingredient.dto';
import { isCastToObjectIdFailed } from '../../../utils/is-cast-to-object-id-failed.util';

@Injectable()
export class IngredientService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(Ingredient.name) private readonly ingredientModel: Model<Ingredient>
  ) {}

  onApplicationBootstrap(): any {
  }

  async getAllIngredients(): Promise<Ingredient[]> {
    const ingredientDocs = await this.ingredientModel.find().sort().exec();
    return ingredientDocs.map(ingredient => ingredient.toJSON());
  }

  async getIngredient(ingredientId: string): Promise<Ingredient> {
    try {
      const ingredient = await this.ingredientModel.findById(ingredientId).exec();
      return ingredient?.toJSON();
    } catch (e) {
      if (isCastToObjectIdFailed(e)) {
        return null;
      } else {
        throw e;
      }
    }
  }

  async create(ingredientDto: CreateOrUpdateIngredientDto): Promise<Ingredient> {
    const ingredient = await this.ingredientModel.create(ingredientDto);
    return ingredient.toJSON();
  }

  async update(ingredientId: string, ingredientDto: CreateOrUpdateIngredientDto): Promise<Ingredient> {
    const ingredient = await this.ingredientModel.findByIdAndUpdate(
      ingredientId,
      ingredientDto,
      { new: true },
    ).exec();

    return ingredient?.toJSON();
  }

  async deleteIngredient(ingredientId: string): Promise<Ingredient> {
    const ingredient = await this.ingredientModel.findByIdAndDelete(ingredientId).exec();
    return ingredient?.toJSON();
  }

  async changeQty(
    ingredientId: string,
    qtyToChange: number,
    session: ClientSession,
  ): Promise<Ingredient> {
    const ingredient = await this.ingredientModel.findByIdAndUpdate(
      ingredientId,
      {
        qty: {
          $inc: qtyToChange,
        }
      },
      { new: true, session },
    ).exec();

    return ingredient?.toJSON();
  }
}
