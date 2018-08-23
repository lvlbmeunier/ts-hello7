import { Application, Request, Response, NextFunction } from 'express';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { useExpressServer, useContainer } from 'routing-controllers';
import { ContainerInstance } from 'typedi';
import { RoutingControllersOptions } from 'routing-controllers/RoutingControllersOptions';

import { VersionController } from '../api/controllers/version.controller';

export const controllerLoader = (container: ContainerInstance): MicroframeworkLoader => {
  return (settings: MicroframeworkSettings) => {
    useContainer(container);

    const app: Application = settings.getData('app');

    const options: RoutingControllersOptions = {
      cors: true,
      classTransformer: true,
      defaultErrorHandler: false,

      controllers: [VersionController],

      middlewares: [], // middlewares from the api/middlewares folder would be added here

      interceptors: [], // interceptors from the api/interceptors folder would be added here
    };

    useExpressServer(app, options);

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      res.status(err.status || err.httpCode || 500);
      res.json({ message: err.message });
    });
  };
};
