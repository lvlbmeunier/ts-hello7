import 'reflect-metadata';

import supertest from 'supertest';
import { Container, ContainerInstance } from 'typedi';
import { Application } from 'express';
import { getApplicationFramework } from '../../src/app';

const randomString = (): string =>
  Math.random()
    .toString(36)
    .slice(2);

export interface IFixtures {
  request: supertest.SuperTest<supertest.Test>;
  container: ContainerInstance;
  release: () => Promise<any>;
}

export const getFixtures = async function(): Promise<IFixtures> {
  const container = Container.of(randomString());
  const framework = await getApplicationFramework('test', container);
  const app: Application = framework.settings.getData('app');

  const release = async () => {
    Container.reset(container.id);
  };

  return {
    request: supertest(app),
    container,
    release,
  };
};
