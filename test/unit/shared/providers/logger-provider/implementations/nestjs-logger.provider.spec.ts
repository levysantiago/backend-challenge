import { NestjsLoggerProvider } from '@shared/providers/logger-provider/implementations/nestjs-logger.provider';

describe('NestjsLoggerProvider', () => {
  let sut: NestjsLoggerProvider;

  beforeAll(() => {});

  beforeEach(() => {
    sut = new NestjsLoggerProvider();

    jest.spyOn(sut['logger'], 'log').mockImplementation(jest.fn());
    jest.spyOn(sut['logger'], 'fatal').mockImplementation(jest.fn());
    jest.spyOn(sut['logger'], 'error').mockImplementation(jest.fn());
    jest.spyOn(sut['logger'], 'warn').mockImplementation(jest.fn());
    jest.spyOn(sut['logger'], 'debug').mockImplementation(jest.fn());
    jest.spyOn(sut['logger'], 'verbose').mockImplementation(jest.fn());
  });

  it('should log messages using the "log" method', () => {
    sut.log('Test log message', 'TestContext');
    expect(jest.spyOn(sut['logger'], 'log')).toHaveBeenCalledWith(
      'Test log message',
      'TestContext',
    );
  });

  it('should log fatal messages using the "fatal" method', () => {
    sut.fatal('Test fatal message', 'TestContext');
    expect(sut['logger'].fatal).toHaveBeenCalledWith(
      'Test fatal message',
      'TestContext',
    );
  });

  it('should log error messages using the "error" method', () => {
    sut.error('Test error message', 'TestContext');
    expect(sut['logger'].error).toHaveBeenCalledWith(
      'Test error message',
      'TestContext',
    );
  });

  it('should log warnings using the "warn" method', () => {
    sut.warn('Test warning message', 'TestContext');
    expect(sut['logger'].warn).toHaveBeenCalledWith(
      'Test warning message',
      'TestContext',
    );
  });

  it('should log debug messages using the "debug" method', () => {
    sut.debug?.('Test debug message', 'TestContext');
    expect(sut['logger'].debug).toHaveBeenCalledWith(
      'Test debug message',
      'TestContext',
    );
  });

  it('should log verbose messages using the "verbose" method', () => {
    sut.verbose?.('Test verbose message', 'TestContext');
    expect(sut['logger'].verbose).toHaveBeenCalledWith(
      'Test verbose message',
      'TestContext',
    );
  });
});
