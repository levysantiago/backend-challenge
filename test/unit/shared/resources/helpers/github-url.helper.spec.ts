import { env } from '@shared/resources/env';
import { GitHubUrlHelper } from '@shared/resources/helpers/github-url.helper';

describe('GitHubUrlHelper', () => {
  beforeAll(() => {
    global.fetch = jest.fn();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('isGithubUrl', () => {
    // Arrange
    const validUrl = 'https://github.com/user/repo';

    it('should return true for a valid GitHub repository URL with 200 response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 200,
      });

      // Act
      const result = await GitHubUrlHelper.isGithubUrl(validUrl);
      // Assert
      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(new URL(validUrl));
    });

    it('should return false for a URL with invalid structure', async () => {
      // Arrange
      const invalidUrl = 'https://example.com/user/repo';
      // Act
      const result = await GitHubUrlHelper.isGithubUrl(invalidUrl);
      // Assert
      expect(result).toBe(false);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should return false for a valid URL with non-200 response', async () => {
      // Arrange
      const validUrl = 'https://github.com/user/repo';
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 404,
      });

      // Act
      const result = await GitHubUrlHelper.isGithubUrl(validUrl);

      // Assert
      expect(result).toBe(false);
      expect(global.fetch).toHaveBeenCalledWith(new URL(validUrl));
    });

    it('should fallback to API and use token if initial fetch fails', async () => {
      // Arrange
      const validUrl = 'https://github.com/user/repo';
      const fallbackUrl = 'https://api.github.com/repos/user/repo';

      (global.fetch as jest.Mock)
        // Simulate first fetch failure
        .mockRejectedValueOnce(new Error('Network error'))
        // Simulate fallback fetch success
        .mockResolvedValueOnce({
          status: 200,
        });

      // Act
      const result = await GitHubUrlHelper.isGithubUrl(validUrl);

      // Assert
      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenNthCalledWith(2, new URL(fallbackUrl), {
        headers: { Authorization: `Bearer ${env.GITHUB_ACCESS_TOKEN}` },
      });
    });

    it('should return false if both fetch and fallback fail', async () => {
      // Arrange
      const validUrl = 'https://github.com/user/repo';

      (global.fetch as jest.Mock)
        // Simulate first fetch failure
        .mockRejectedValueOnce(new Error('Network error'))
        // Simulate fallback fetch failure
        .mockRejectedValueOnce(new Error('Fallback error'));

      // Act
      const promise = GitHubUrlHelper.isGithubUrl(validUrl);

      // Assert
      expect(promise).rejects.toThrow(new Error('Fallback error'));
      promise.catch(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('_checkUrlStructure', () => {
    it('should return true for a valid GitHub URL structure', () => {
      // Act
      const result = GitHubUrlHelper['_checkUrlStructure'](
        'https://github.com/user/repo',
      );
      // Assert
      expect(result).toBe(true);
    });

    it('should return false for an invalid URL structure', () => {
      // Act
      const result = GitHubUrlHelper['_checkUrlStructure'](
        'https://github.com/user',
      );
      // Assert
      expect(result).toBe(false);
    });

    it('should return false for an invalid URL string', () => {
      // Act
      const result = GitHubUrlHelper['_checkUrlStructure']('invalid url');
      // Assert
      expect(result).toBe(false);
    });

    it('should return false for a non-GitHub URL', () => {
      // Act
      const result = GitHubUrlHelper['_checkUrlStructure'](
        'https://example.com/user/repo',
      );
      // Assert
      expect(result).toBe(false);
    });
  });
});
