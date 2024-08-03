import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategorySchema } from '../schemas/category.schema';
import { CreateOrUpdateCategoryDto } from '../dtos/create-or-update-category.dto';
import { ReorderCategoriesDto } from '../dtos/reorder-categories.dto';
import { FastifyRequest } from 'fastify';
import { PhotoUploadService } from '../../photo-upload/services/photo-upload.service';
import { isCastToObjectIdFailed } from '../../../utils/is-cast-to-object-id-failed.util';

@Injectable()
export class CategoryService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    private readonly photoService: PhotoUploadService,
  ) {}

  onApplicationBootstrap(): any {
  }

  async getAllCategories(): Promise<Category[]> {
    const sortOrderKey: keyof Category = 'sortOrder';

    const categoryDocs = await this.categoryModel.find().sort({ [sortOrderKey]: 'asc' }).exec();
    return categoryDocs.map(category => category.toJSON());
  }

  async getCategory(categoryId: string): Promise<Category> {
    try {
      const category = await this.categoryModel.findById(categoryId).exec();
      return category?.toJSON();
    } catch (e) {
      if (isCastToObjectIdFailed(e)) {
        return null;
      } else {
        throw e;
      }
    }
  }

  async create(categoryDto: CreateOrUpdateCategoryDto): Promise<Category> {
    const highestSortOrder = await this.calcHighestSortOrder();
    const category = await this.categoryModel.create({
      ...categoryDto,
      sortOrder: highestSortOrder,
    });
    return category.toJSON();
  }

  async update(categoryId: string, categoryDto: CreateOrUpdateCategoryDto): Promise<Category> {
    const category = await this.categoryModel.findByIdAndUpdate(categoryId, categoryDto, { new: true }).exec();
    return category?.toJSON();
  }

  async deleteCategory(categoryId: string): Promise<Category> {
    const category = await this.categoryModel.findByIdAndDelete(categoryId).exec();
    return category?.toJSON();
  }

  async reorderCategories(reorderCategoriesDto: ReorderCategoriesDto): Promise<Category[]> {
    const ids = reorderCategoriesDto.categories.map(category => category.id);
    const categories = await this.categoryModel.find({ _id: { $in: ids } }).exec();

    for (const category of categories) {
      const categoryDto = reorderCategoriesDto.categories.find(categoryDto => categoryDto.id === category.id);
      category.sortOrder = categoryDto.newSortOrder;
    }

    await this.categoryModel.bulkSave(categories);

    return this.getAllCategories();
  }

  async uploadPhoto(request: FastifyRequest): Promise<string> {
    return this.photoService.upload(request, Category.collectionName);
  }

  private async calcHighestSortOrder(): Promise<number> {
    const sortOrderKey: keyof Category = 'sortOrder';
    const categories = await this.categoryModel.find().sort({ [sortOrderKey]: 'desc' }).limit(1).exec();

    return categories[0]
      ? categories[0].sortOrder + 1
      : 0;
  }
}
