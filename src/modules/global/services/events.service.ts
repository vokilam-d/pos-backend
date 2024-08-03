import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import { Order } from '../../order/schemas/order.schema';

export enum EventName {
  NewOrder = 'NEW_ORDER',
}

type EventMap = {
  [EventName.NewOrder]: [Order];
}

@Injectable()
export class EventsService {

  private readonly eventEmitter = new EventEmitter<EventMap>();

  get on() { return this.eventEmitter.on<EventName>; }
  get once() { return this.eventEmitter.once; }
  get off() { return this.eventEmitter.off; }
  get emit() { return this.eventEmitter.emit; }

}
