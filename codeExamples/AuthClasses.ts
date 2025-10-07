import { LoggerService } from '@backstage/backend-plugin-api';


interface AccessTokenResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
}

interface ClientCredentials {
  clientId: string;
  clientSecret: string;
}

export class AuthorizationClient implements IAuthorizationClient {
  private logger: LoggerService;

  constructor(
    private authServerUrl: string,
    private credentials: ClientCredentials,
    private scope: string,
    logger: LoggerService
  ) {
    this.logger = logger.child({ service: 'credentials-client' });
  }

  public async getAuthorization(): Promise<Authorization> {
    try {
      const response = await fetch(this.authServerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.credentials.clientId,
          client_secret: this.credentials.clientSecret,
          scope: this.scope,
        }),
      });

      if (!response.ok) {
        const { error, error_description }: { error: string; error_description: string } = await response.json();
        this.logger.error(`Failed fetch: ${error} ${error_description}`, {
          response: { error, error_description },
        });

        throw new Error(`HTTP ${response.status}`, {
          cause: { error, error_description },
        });
      }

      const { token_type, access_token, expires_in }: AccessTokenResponse = await response.json();

      return new Authorization(token_type, access_token, expires_in);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err) || 'Unknown error');
      this.logger.error('Error while fetching credentials', error);
      throw error;
    }
  }

  public async getFreshAuthorization(): Promise<Authorization> {
    return this.getAuthorization();
  }
}

export interface IAuthorizationClient {
  getAuthorization(): Promise<Authorization>;
  getFreshAuthorization(): Promise<Authorization>;
}





export class Authorization {
  private expiresAt: number;

  public constructor(private tokenType: string, private accessToken: string, expiresInSeconds: number) {
    this.expiresAt = Date.now() + 1000 * (expiresInSeconds - 15);
  }

  public isExpired(): boolean {
    return this.expiresAt < Date.now();
  }

  public getAuthorization(): string {
    return `${this.tokenType} ${this.accessToken}`;
  }
}
