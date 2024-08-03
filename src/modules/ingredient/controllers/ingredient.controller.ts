import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IngredientService } from '../services/ingredient.service';
import { CreateOrUpdateIngredientDto } from '../dtos/create-or-update-ingredient.dto';
import { IngredientDto } from '../dtos/ingredient.dto';
import { toDto } from '../../../utils/to-dto.util';

@Controller('ingredients')
@UsePipes(new ValidationPipe({ transform: true }))
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Get()
  async getAllIngredients(): Promise<IngredientDto[]> {
    const ingredients = await this.ingredientService.getAllIngredients();
    return ingredients.map(ingredient => toDto(IngredientDto, ingredient));
  }

  @Get(':id')
  async getIngredient(@Param('id') ingredientId: string): Promise<IngredientDto> {
    const ingredient = await this.ingredientService.getIngredient(ingredientId);
    if (!ingredient) {
      throw new NotFoundException(`Ingredient with id ${ingredientId} not found`);
    }

    return toDto(IngredientDto, ingredient);
  }

  @Post()
  async create(@Body() ingredientDto: CreateOrUpdateIngredientDto): Promise<IngredientDto> {
    const ingredient = await this.ingredientService.create(ingredientDto);
    return toDto(IngredientDto, ingredient);
  }

  @Put(':id')
  async update(
    @Param('id') ingredientId: string,
    @Body() ingredientDto: CreateOrUpdateIngredientDto,
  ): Promise<IngredientDto> {
    const ingredient = await this.ingredientService.update(ingredientId, ingredientDto);
    if (!ingredient) {
      throw new NotFoundException(`Ingredient with id ${ingredientId} not found`);
    }

    return toDto(IngredientDto, ingredient);
  }

  @Delete(':id')
  async deleteIngredient(@Param('id') ingredientId: string): Promise<IngredientDto> {
    const ingredient = await this.ingredientService.deleteIngredient(ingredientId);
    if (!ingredient) {
      throw new NotFoundException(`Ingredient with id ${ingredientId} not found`);
    }

    return toDto(IngredientDto, ingredient);
  }
}
