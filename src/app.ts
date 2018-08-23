import { bootstrapMicroframework, Microframework } from 'microframework-w3tec';

import { expressLoader } from './loaders/express.loader';
import { controllerLoader } from './loaders/api.loader';
import { swaggerLoader } from './loaders/swagger.loader';
import { winstonLoader } from './loaders/winston.loader';
import { Environment } from './env';
import { ContainerInstance } from 'typedi';

export const getApplicationFramework = (environment: string, container: ContainerInstance): Promise<Microframework> => {
  const env = new Environment(environment);
  container.set(Environment, env);

  return bootstrapMicroframework([
    winstonLoader(env),
    expressLoader(env),
    swaggerLoader(env),
    controllerLoader(container),
  ]);
};
