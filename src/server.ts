import 'reflect-metadata';
import winston from 'winston';

import { Application } from 'express';
import { Container } from 'typedi';

import { Environment } from './env';
import { getApplicationFramework } from './app';

const logAndExit = (err: Error): void => {
  console.error('Application crash on startup:', err);
  process.exit(1);
};

const randomString = (): string => {
  return Math.random()
    .toString(36)
    .slice(2);
};

const container = Container.of(randomString());

getApplicationFramework(process.env.NODE_ENV || 'development', container)
  .then(framework => {
    const app: Application = framework.settings.getData('app');
    const env = container.get(Environment);
    app.listen(env.app.port, () =>
      winston.info(`Application running on port: ${env.app.port}, with environment: ${env.node}`)
    );
    app.on('error', logAndExit);
  })
  .catch(logAndExit);
