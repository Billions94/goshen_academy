import { Get, JsonController } from 'routing-controllers';

@JsonController('/health')
export class HealthController {
  @Get()
  public async healthCheck(): Promise<{ status: string }> {
    return { status: 'OK' };
  }
}
