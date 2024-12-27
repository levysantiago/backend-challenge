import { HeartbeatResolver } from '@modules/heartbeat/infra/http/resolvers/heartbeat.resolver';
import { HeartbeatService } from '@modules/heartbeat/services/heartbeat.service';
import { mock, MockProxy } from 'jest-mock-extended';

describe('HeartbeatResolver', () => {
  let sut: HeartbeatResolver;
  let heartbeatService: MockProxy<HeartbeatService>;

  const mockMessage = 'Heartbeat message';

  beforeAll(() => {
    heartbeatService = mock();
    heartbeatService.execute.mockReturnValue(mockMessage);
  });

  beforeEach(async () => {
    sut = new HeartbeatResolver(heartbeatService);
  });

  describe('heartbeat', () => {
    it('should be able to return heartbeat message', () => {
      // Act
      const result = sut.heartbeat();
      // Assert
      expect(result).toEqual(mockMessage);
    });
  });
});
