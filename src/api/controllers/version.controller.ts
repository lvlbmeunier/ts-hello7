import { Environment } from '../../env';
import { JsonController, Get } from 'routing-controllers';

@JsonController('/version')
export class VersionController {
  constructor(private env: Environment) {}

  @Get('/')
  public async getVersion() {
    return {
      environment: this.env.node,
      version: this.env.app.version,
      description: this.env.app.description,
    };
  }
}
