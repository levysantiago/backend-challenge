import { ClientKafka } from '@nestjs/microservices';
import { LoggerProvider } from '@shared/providers/logger-provider/types/logger.provider';
import { ICorrectLessonResponse } from '@shared/providers/messaging-provider/dtos/icorrect-lessons-response';
import { KafkaMessagingProvider } from '@shared/providers/messaging-provider/implementations/kafka-messaging.provider';
import { mock, MockProxy } from 'jest-mock-extended';

describe('KafkaMessagingProvider', () => {
  let sut: KafkaMessagingProvider;
  let logger: MockProxy<LoggerProvider>;
  let clientKafka: MockProxy<ClientKafka>;

  const mockResult: ICorrectLessonResponse = {
    submissionId: '123',
    repositoryUrl: 'https://repo.com',
    grade: 8,
    status: 'Done',
  };

  const consumerMock = {
    subscribe: jest.fn(),
    disconnect: jest.fn(),
    run: jest.fn(async ({ eachMessage }) => {
      await eachMessage({
        topic: 'challenge.correction.reply',
        message: { value: JSON.stringify(mockResult) },
      });
    }),
  };

  beforeAll(() => {
    logger = mock();
    clientKafka = mock();

    clientKafka.subscribeToResponseOf.mockReturnValue();
    clientKafka.close.mockResolvedValue();
    clientKafka.connect.mockResolvedValue({} as any);
    clientKafka.send.mockReturnValue({
      subscribe: jest.fn(),
    } as any);
    clientKafka['client'] = {
      consumer: jest.fn().mockReturnValue(consumerMock),
    } as any;
  });

  beforeEach(async () => {
    sut = new KafkaMessagingProvider(clientKafka, logger);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should subscribe to the "challenge.correction" response', async () => {
      // Act
      await sut.onModuleInit();

      // Assert
      expect(clientKafka.subscribeToResponseOf).toHaveBeenCalledWith(
        'challenge.correction',
      );
      expect(consumerMock.subscribe).toHaveBeenCalledWith({
        topic: 'challenge.correction.reply',
      });
    });

    it('should get consumer instance with right groupId', async () => {
      // Act
      await sut.onModuleInit();

      // Assert
      expect(clientKafka['client'].consumer).toHaveBeenCalledWith({
        groupId: 'challenge-consumer',
      });
    });
  });

  describe('consumeChallengeCorrectionResponse', () => {
    it('should be able to call consumer.run with right parameters', async () => {
      // Arrange
      await sut.onModuleInit();
      const callbackService = jest.fn();

      // Act
      await sut.consumeChallengeCorrectionResponse({ callbackService });

      // Assert
      expect(consumerMock.run).toHaveBeenCalledWith({
        eachMessage: expect.any(Function),
      });
    });

    it('should be able to call callbackService with kafka message result', async () => {
      // Arrange
      await sut.onModuleInit();
      const callbackService = jest.fn();

      // Act
      await sut.consumeChallengeCorrectionResponse({ callbackService });

      // Assert
      expect(callbackService).toHaveBeenCalledWith(mockResult);
    });

    it('should log error if callbackService throws', async () => {
      // Arrange
      await sut.onModuleInit();
      const loggerSpy = jest.spyOn(logger, 'error');
      const callbackService = jest
        .fn()
        .mockRejectedValueOnce(new Error('Callback error'));

      // Act
      await sut.consumeChallengeCorrectionResponse({ callbackService });

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith(
        'Error in callbackService: Callback error',
        'KafkaMessagingProvider',
      );
    });
  });

  describe('emitChallengeCorrection', () => {
    // Arrange
    const message = {
      submissionId: '123',
      repositoryUrl: 'https://repo.com',
    };

    it('should be able to send the message', async () => {
      // Act
      sut.emitChallengeCorrection(message);

      // Assert
      expect(clientKafka.send).toHaveBeenCalledWith(
        'challenge.correction',
        JSON.stringify(message),
      );
    });

    it('should log errors when microservice communication fails', async () => {
      // Arrange
      const mockObservable = {
        subscribe: jest.fn((handlers) => {
          handlers.error(new Error('Communication error'));
        }),
      };
      clientKafka.send.mockReturnValueOnce(mockObservable as any);

      const loggerSpy = jest
        .spyOn(logger, 'error')
        .mockImplementation(() => {});

      // Act
      sut.emitChallengeCorrection(message);

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith(
        'Error in microservice communication: Communication error',
        'KafkaMessagingProvider',
      );

      loggerSpy.mockRestore();
    });
  });

  describe('onModuleDestroy', () => {
    it('should close the Kafka client', async () => {
      await sut.onModuleInit();

      // Act
      await sut.onModuleDestroy();

      // Assert
      expect(clientKafka.close).toHaveBeenCalled();
    });
  });
});
