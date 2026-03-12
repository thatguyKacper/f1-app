import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CircuitsService {
  constructor(private prisma: PrismaService) {}

  async getCircuitById(id: number) {
    const circuit = await this.prisma.formula_one_circuit.findUnique({
      where: { id },
      include: {
        formula_one_round: {
          include: { formula_one_season: true },
          orderBy: { formula_one_season: { year: 'desc' } },
          take: 5,
        },
      },
    });

    if (!circuit) throw new NotFoundException('Circuit not found');
    return circuit;
  }
}
