import { Test, TestingModule } from '@nestjs/testing';
import { F1Service } from './f1.service.js';

describe('F1Service', () => {
  let service: F1Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [F1Service],
    }).compile();

    service = module.get<F1Service>(F1Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
