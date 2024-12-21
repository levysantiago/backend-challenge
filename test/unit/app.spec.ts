import { Test, TestingModule } from '@nestjs/testing';
import { AppResolver } from '../../src/app.resolver';
import { AppService } from '../../src/app.service';

describe('AppResolver', () => {
  let resolver: AppResolver;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppResolver,
        {
          provide: AppService,
          useValue: {
            getHello: jest.fn(), // Mock the `getHello` method
          },
        },
      ],
    }).compile();

    resolver = module.get<AppResolver>(AppResolver);
    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should call AppService.getHello and return the expected result', () => {
    const mockResult = 'Hello, World!';
    jest.spyOn(appService, 'getHello').mockReturnValue(mockResult);

    const result = resolver.getHello();

    expect(appService.getHello).toHaveBeenCalled(); // Ensure the service method is called
    expect(result).toBe(mockResult); // Ensure the resolver returns the service's result
  });
});
