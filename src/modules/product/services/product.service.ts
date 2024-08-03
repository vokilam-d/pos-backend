import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../schemas/product.schema';
import { CreateOrUpdateProductDto } from '../dtos/create-or-update-product.dto';
import { ReorderProductsDto } from '../dtos/reorder-products.dto';
import { FastifyRequest } from 'fastify';
import { PhotoUploadService } from '../../photo-upload/services/photo-upload.service';
import { EventName, EventsService } from '../../global/services/events.service';
import { Order } from '../../order/schemas/order.schema';
import { IngredientService } from '../../ingredient/services/ingredient.service';
import { isCastToObjectIdFailed } from '../../../utils/is-cast-to-object-id-failed.util';

@Injectable()
export class ProductService implements OnApplicationBootstrap {

  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly photoService: PhotoUploadService,
    private readonly eventsService: EventsService,
    private readonly ingredientService: IngredientService,
  ) {}

  onApplicationBootstrap(): any {
    this.eventsService.on(EventName.NewOrder, order => this.onNewOrder(order))
  }

  async getAllProducts(): Promise<Product[]> {
    const sortOrderKey: keyof Product = 'sortOrder';

    const productDocs = await this.productModel.find().sort({ [sortOrderKey]: 'asc' }).exec();
    return productDocs.map(product => product.toJSON());
  }

  async getProduct(productId: string): Promise<Product> {
    try {
      const product = await this.productModel.findById(productId).exec();
      return product?.toJSON();
    } catch (e) {
      if (isCastToObjectIdFailed(e)) {
        return null;
      } else {
        throw e;
      }
    }
  }

  async create(productDto: CreateOrUpdateProductDto): Promise<Product> {
    const highestSortOrder = await this.calcHighestSortOrder();
    const product = await this.productModel.create({
      ...productDto,
      sortOrder: highestSortOrder,
    });
    return product.toJSON();
  }

  async update(productId: string, productDto: CreateOrUpdateProductDto): Promise<Product> {
    const product = await this.productModel.findByIdAndUpdate(productId, productDto, { new: true }).exec();
    return product?.toJSON();
  }

  async deleteProduct(productId: string): Promise<Product> {
    const product = await this.productModel.findByIdAndDelete(productId).exec();
    return product?.toJSON();
  }

  async reorderProducts(reorderProductsDto: ReorderProductsDto): Promise<Product[]> {
    const ids = reorderProductsDto.products.map(product => product.id);
    const products = await this.productModel.find({ _id: { $in: ids } }).exec();

    for (const product of products) {
      const productDto = reorderProductsDto.products.find(productDto => productDto.id === product.id);
      product.sortOrder = productDto.newSortOrder;
    }

    await this.productModel.bulkSave(products);

    return this.getAllProducts();
  }

  async uploadPhoto(request: FastifyRequest): Promise<string> {
    return this.photoService.upload(request, Product.collectionName);
  }

  private async calcHighestSortOrder(): Promise<number> {
    const sortOrderKey: keyof Product = 'sortOrder';
    const products = await this.productModel.find().sort({ [sortOrderKey]: 'desc' }).limit(1).exec();

    return products[0]
      ? products[0].sortOrder + 1
      : 0;
  }

  private async onNewOrder(order: Order): Promise<void> {
    for (const orderItem of order.orderItems) {
      const session = await this.productModel.db.startSession();
      session.startTransaction();

      try {
        const product = await this.productModel.findById(orderItem.productId, null, { session }).exec();
        if (!product) {
          this.logger.warn(`onNewOrder - Could not find product "${orderItem.productId}", orderId=${order._id}`);
          continue;
        }

        for (const ingredient of product.ingredients) {
          await this.ingredientService.changeQty(ingredient.ingredientId, -ingredient.qty, session);
        }

        product.salesCount += orderItem.qty;
        await product.save({ session });

      } catch (error) {
        this.logger.error(`Could not update sales count of product (productId=${orderItem.productId}):`);
        this.logger.error(error);

        await session.abortTransaction();
      } finally {
        await session.endSession();
      }
    }
  }
}
