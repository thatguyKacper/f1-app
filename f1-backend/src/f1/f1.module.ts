import { Module } from '@nestjs/common';
import { F1Service } from './f1.service.js';
import { F1Controller } from './f1.controller.js';

@Module({
  providers: [F1Service],
  controllers: [F1Controller],
})
export class F1Module {}
