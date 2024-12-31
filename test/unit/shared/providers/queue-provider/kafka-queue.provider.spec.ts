import { ClientKafka } from '@nestjs/microservices';
import { ICorrectLessonResponse } from '@shared/providers/messaging-provider/dtos/icorrect-lessons-response';
import { KafkaMessagingProvider } from '@shared/providers/messaging-provider/implementations/kafka-messaging.provider';
import { mock, MockProxy } from 'jest-mock-extended';

describe('KafkaMessagingProvider', () => {
  let sut: KafkaMessagingProvider;
  let clientKafka: MockProxy<ClientKafka>;

  const mockResponse: ICorrectLessonResponse = {
    submissionId: '123',
    repositoryUrl: 'https://repo.com',
    grade: 8,
    status: 'Done',
  };

  beforeAll(() => {
    clientKafka = mock();

    clientKafka.subscribeToResponseOf.mockReturnValue();
    clientKafka.close.mockResolvedValue();
    clientKafka.connect.mockResolvedValue({} as any);
    clientKafka.send.mockReturnValue({
      subscribe: jest.fn((handlers) => {
        handlers.next(mockResponse);
      }),
    } as any);
  });

  beforeEach(async () => {
    sut = new KafkaMessagingProvider(clientKafka);
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
    });
  });

  describe('emitChallengeCorrection', () => {
    // Arrange
    const message = {
      submissionId: '123',
      repositoryUrl: 'https://repo.com',
    };

    it('should send the message and call the callback on success', async () => {
      const callbackService = jest.fn().mockResolvedValueOnce(undefined);

      // Act
      sut.emitChallengeCorrection(message, callbackService);

      // Assert
      expect(clientKafka.send).toHaveBeenCalledWith(
        'challenge.correction',
        JSON.stringify(message),
      );
      expect(callbackService).toHaveBeenCalledWith(mockResponse);
    });

    it('should handle errors in the callbackService gracefully', async () => {
      const callbackService = jest
        .fn()
        .mockRejectedValueOnce(new Error('Callback error'));

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // Act
      sut.emitChallengeCorrection(message, callbackService);

      // Assert
      expect(callbackService).toHaveBeenCalledWith(mockResponse);

      consoleSpy.mockRestore();
    });

    it('should log errors when microservice communication fails', async () => {
      // Arrange
      const mockObservable = {
        subscribe: jest.fn((handlers) => {
          handlers.error(new Error('Communication error'));
        }),
      };
      clientKafka.send.mockReturnValueOnce(mockObservable as any);

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // Act
      sut.emitChallengeCorrection(message, jest.fn());

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        '[KafkaMessagingProvider] Error in microservice communication:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });
  });

  describe('onModuleDestroy', () => {
    it('should close the Kafka client', async () => {
      // Act
      await sut.onModuleDestroy();

      // Assert
      expect(clientKafka.close).toHaveBeenCalled();
    });
  });
});
