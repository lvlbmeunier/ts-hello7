import express, { Application } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { Environment } from '../env';

export const expressLoader = (env: Environment): MicroframeworkLoader => {
  return (settings: MicroframeworkSettings) => {
    const app: Application = express();

    if (env.app.hasProxy) {
      app.set('trust proxy', 1);
    }

    app.use(morgan('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    settings.setData('app', app);
  };
};
