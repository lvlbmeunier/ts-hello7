import * as fs from 'fs';
import * as path from 'path';

import { Application, Request, Response, NextFunction } from 'express';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { load as parseYaml } from 'js-yaml';

import * as swaggerUi from 'swagger-ui-express';
import basicAuth from 'express-basic-auth';

import { Environment } from '../env';

const swaggerYaml = fs.readFileSync(path.resolve('contract', 'openapi.yaml'), 'utf8');
export const swaggerLoader = (env: Environment): MicroframeworkLoader => {
  return (settings: MicroframeworkSettings) => {
    if (!env.swagger.enabled) {
      return undefined;
    }

    const app: Application = settings.getData('app');

    const opts = parseYaml(swaggerYaml);
    opts.info.version = env.app.version;
    opts.servers = [{ url: env.app.publicUrl }];

    const { username = '', password = '' } = env.swagger || {};

    const basicAuthMiddleware =
      username && password
        ? basicAuth({
            users: { [username]: password },
            challenge: true,
          })
        : (req: Request, res: Response, next: NextFunction) => next();

    app.use('/swagger', basicAuthMiddleware, swaggerUi.serve, swaggerUi.setup(opts));
  };
};
