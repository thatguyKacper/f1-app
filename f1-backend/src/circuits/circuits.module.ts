import { Module } from '@nestjs/common';
import { CircuitsController } from './circuits.controller.js';
import { CircuitsService } from './circuits.service.js';

@Module({
  controllers: [CircuitsController],
  providers: [CircuitsService],
})
export class CircuitsModule {}
