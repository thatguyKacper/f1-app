import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { F1Module } from './f1/f1.module.js';
import { SeasonsModule } from './seasons/seasons.module.js';
import { StandingsModule } from './standings/standings.module.js';
import { RacesModule } from './races/races.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    F1Module,
    SeasonsModule,
    StandingsModule,
    RacesModule,
  ],
})
export class AppModule {}
