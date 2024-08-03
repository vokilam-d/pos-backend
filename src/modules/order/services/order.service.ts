import { BadRequestException, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel, Prop } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../schemas/order.schema';
import { CreateOrUpdateOrderDto } from '../dtos/create-or-update-order.dto';
import { ProductService } from '../../product/services/product.service';
import { EventName, EventsService } from '../../global/services/events.service';
import { IngredientService } from '../../ingredient/services/ingredient.service';
import { OrderItemSelectedOptionDto } from '../dtos/order-item-selected-option.dto';
import { OrderItemSelectedOption } from '../schemas/order-item-selected-option.schema';
import { OrderItem } from '../schemas/order-item.schema';
import { OrderItemIngredient } from '../schemas/order-item-ingredient.schema';
import { SelectedIngredient } from '../../product/schemas/selected-ingredient.schema';
import { isCastToObjectIdFailed } from '../../../utils/is-cast-to-object-id-failed.util';

@Injectable()
export class OrderService implements OnApplicationBootstrap {

  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    private readonly productService: ProductService,
    private readonly ingredientService: IngredientService,
    private readonly eventsService: EventsService,
  ) {}

  onApplicationBootstrap(): any {
  }

  async getAllOrders(): Promise<Order[]> {
    const orderDocs = await this.orderModel.find().sort({ _id: -1 }).exec();
    return orderDocs.map(order => order.toJSON());
  }

  async getOrder(orderId: number): Promise<Order> {
    try {
      const order = await this.orderModel.findById(orderId).exec();
      return order?.toJSON();
    } catch (e) {
      if (isCastToObjectIdFailed(e)) {
        return null;
      } else {
        throw e;
      }
    }
  }

  async create(orderDto: CreateOrUpdateOrderDto): Promise<Order> {
    const ingredients = await this.ingredientService.getAllIngredients();
    const orderItems: OrderItem[] = [];

    for (const orderItemDto of orderDto.orderItems) {
      const product = await this.productService.getProduct(orderItemDto.productId);
      if (!product) {
        throw new BadRequestException(`Product with ID "${orderItemDto.productId}" not found`);
      }

      if (orderItemDto.selectedOptions.length !== product.options.length) {
        throw new BadRequestException(`Count of options does not match for product "${product.name}"(${product._id})`);
      }

      const selectedOptions: OrderItemSelectedOption[] = orderItemDto.selectedOptions.map(selectedOption => {
        const option = product.options.find(option => option.id === selectedOption.optionId);
        if (!option) {
          throw new BadRequestException(`No option with ID "${selectedOption.optionId}" in product "${product.name}"(${product._id})`);
        }
        const optionValue = option.values.find(optionValue => optionValue.id === selectedOption.optionValueId);
        if (!optionValue) {
          throw new BadRequestException(`No option value with ID "${selectedOption.optionId}" in option "${option.name}" in product "${product.name}"(${product._id})`);
        }

        return {
          optionId: option.id,
          optionName: option.name,
          optionValueId: optionValue.id,
          optionValueName: optionValue.name,
        };
      });

      const variant = product.variants.find(variant => {
        return variant.selectedOptions.find(productSelectedOption => {
          return selectedOptions.find(orderItemSelectedOption => {
            return orderItemSelectedOption.optionId === productSelectedOption.optionId
              && orderItemSelectedOption.optionValueId === productSelectedOption.optionValueId;
          });
        })
      });

      if (!variant) {
        throw new BadRequestException(`No such variant exist for product "${product.name}"(${product._id})`);
      }

      const selectedIngredients: SelectedIngredient[] = [...product.ingredients, ...variant.ingredients];

      const orderItemIngredients: OrderItemIngredient[] = selectedIngredients.map(selectedIngredient => {
        const ingredient = ingredients.find(ingredient => ingredient._id === selectedIngredient.ingredientId);
        if (!ingredient) {
          throw new BadRequestException(`Ingredient with ID "${selectedIngredient.ingredientId}" not found`);
        }

        return {
          ingredientId: ingredient._id,
          name: ingredient.name,
          price: ingredient.price,
          unit: ingredient.unit,
          qty: selectedIngredient.qty,
          cost: ingredient.price * selectedIngredient.qty,
        };
      });

      const primeCost = orderItemIngredients.reduce((acc, ing) => acc + ing.cost, 0);
      const price = primeCost * (variant.markupPercent / 100);
      const profit = price - primeCost;

      orderItems.push({
        productId: product._id,
        name: product.name,
        photoUrl: product.photoUrl,
        selectedOptions: selectedOptions,
        ingredients: orderItemIngredients,
        primeCost: primeCost,
        markupPercent: variant.markupPercent,
        price: price,
        profit: profit,
        qty: orderItemDto.qty,
        totalPrice: price * orderItemDto.qty,
        totalProfit: profit * orderItemDto.qty,
      });
    }

    const orderDocContents: Order = {
      _id: await this.getHighestOrderId(),
      createdAtIso: orderDto.createdAtIso || new Date().toISOString(),
      paymentType: orderDto.paymentType,
      orderItems: orderItems,
      totalPrice: orderItems.reduce((acc, item) => acc + item.totalPrice, 0),
      totalProfit: orderItems.reduce((acc, item) => acc + item.totalProfit, 0),
    };

    const order = await this.orderModel.create(orderDocContents);

    this.eventsService.emit(EventName.NewOrder, order.toJSON());

    return order.toJSON();
  }

  async deleteOrder(orderId: string): Promise<Order> {
    const order = await this.orderModel.findByIdAndDelete(orderId).exec();
    return order?.toJSON();
  }

  private async getHighestOrderId(): Promise<number> {
    const orders = await this.orderModel.find().sort({ _id: -1 }).limit(1).exec();
    const currentHighestOrderId = orders[0]?._id || 0;
    return currentHighestOrderId + 1;
  }
}
