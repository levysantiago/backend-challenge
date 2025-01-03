import { HeartbeatService } from '@modules/heartbeat/services/heartbeat.service';

describe('HeartbeatService', () => {
  let sut: HeartbeatService;

  beforeEach(() => {
    sut = new HeartbeatService();
  });

  describe('execute', () => {
    console.log(process.env);

    it('should be able to return heartbeat message', () => {
      // Act
      const result = sut.execute();
      // Assert
      expect(result).toEqual('Challenges API running! 🚀');
    });
  });
});
