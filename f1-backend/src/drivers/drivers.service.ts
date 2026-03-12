import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DriversService {
  constructor(private prisma: PrismaService) {}

  async getDriverById(id: number) {
    const driver = await this.prisma.formula_one_driver.findUnique({
      where: { id },
      include: {
        formula_one_teamdriver: {
          include: {
            formula_one_team: true,
            formula_one_season: true,
          },
          orderBy: { formula_one_season: { year: 'desc' } },
        },
      },
    });

    if (!driver) throw new NotFoundException('Driver not found');
    return driver;
  }
}
