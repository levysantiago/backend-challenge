import { env } from '../env';

export class GitHubUrlHelper {
  static async isGithubUrl(url: string): Promise<boolean> {
    // Validate URL structure
    const isValidStructure = this._checkUrlStructure(url);
    if (isValidStructure) {
      return this._checkUrlCall(url);
    }

    // Invalid URL
    return false;
  }

  private static _checkUrlStructure(url: string): boolean {
    try {
      // Parsing URL
      const parsedUrl = new URL(url);
      // Check GitHub host
      if (parsedUrl.hostname !== 'github.com') return false;

      // Split {owner}/{repository} parts
      const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
      // Ensure {owner}/{repository}
      return pathParts.length === 2;
    } catch (error) {
      // Invalid URL
      return false;
    }
  }

  private static async _checkUrlCall(url: string): Promise<boolean> {
    // Fetch url
    const response = await this._fetchUrl(url);
    // Check response status
    if (response.status === 200) {
      // Valid URL
      return true;
    }
    // Invalid URL
    return false;
  }

  private static async _fetchUrl(url: string): Promise<Response> {
    let response: Response;
    const parsedURL = new URL(url);
    try {
      // Making a request to the URL
      response = await fetch(parsedURL);
    } catch (err) {
      // FALLBACK
      parsedURL.hostname = 'api.github.com';
      parsedURL.pathname = `/repos${parsedURL.pathname}`;

      // Making a request to the URL
      response = await fetch(parsedURL, {
        headers: {
          Authorization: `Bearer ${env.GITHUB_ACCESS_TOKEN}`,
        },
      });
    }

    return response;
  }
}
