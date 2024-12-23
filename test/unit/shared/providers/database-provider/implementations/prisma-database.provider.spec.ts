import { INestApplication } from '@nestjs/common';
import { PrismaDatabaseProvider } from '@shared/providers/database-provider/implementations/prisma-database.provider';

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: class {
      $connect = jest.fn();
      $on = jest.fn();
    },
  };
});

describe('PrismaDatabaseProvider', () => {
  let sut: PrismaDatabaseProvider;

  beforeEach(() => {
    sut = new PrismaDatabaseProvider();
  });

  describe('onModuleInit', () => {
    it('should call $connect when the module initializes', async () => {
      const connectSpy = jest.spyOn(sut, '$connect');

      await sut.onModuleInit();

      expect(connectSpy).toHaveBeenCalled();
    });
  });

  describe('enableShutdownHooks', () => {
    it('should register a shutdown hook for beforeExit event', async () => {
      const appMock: Partial<INestApplication> = {
        close: jest.fn(),
      };
      const onSpy = jest.spyOn(sut, '$on');

      await sut.enableShutdownHooks(appMock as INestApplication);

      expect(onSpy).toHaveBeenCalledWith('beforeExit', expect.any(Function));

      // Simulate beforeExit event to verify app.close is called
      // eslint-disable-next-line @typescript-eslint/ban-types
      const beforeExitCallback = onSpy.mock.calls[0][1] as Function;
      await beforeExitCallback();

      expect(appMock.close).toHaveBeenCalled();
    });
  });
});
