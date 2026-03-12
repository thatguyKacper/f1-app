import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { SeasonsModule } from './seasons/seasons.module.js';
import { StandingsModule } from './standings/standings.module.js';
import { RacesModule } from './races/races.module.js';
import { DriversModule } from './drivers/drivers.module.js';
import { CircuitsModule } from './circuits/circuits.module.js';
import { TeamsModule } from './teams/teams.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    SeasonsModule,
    StandingsModule,
    RacesModule,
    DriversModule,
    CircuitsModule,
    TeamsModule,
  ],
})
export class AppModule {}
