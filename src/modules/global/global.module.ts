import { Global, Module } from '@nestjs/common';
import { EventsService } from './services/events.service';

@Global()
@Module({
  providers: [EventsService],
  exports: [EventsService],
})
export class GlobalModule {}
