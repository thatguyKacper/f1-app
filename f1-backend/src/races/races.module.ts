import { Module } from '@nestjs/common';
import { RacesController } from './races.controller.js';
import { RacesService } from './races.service.js';

@Module({
  controllers: [RacesController],
  providers: [RacesService],
})
export class RacesModule {}
