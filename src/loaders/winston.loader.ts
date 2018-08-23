import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import * as winston from 'winston';
import { Environment } from '../env';

const { combine, timestamp, splat, printf } = winston.format;

const format = printf(info => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

export const winstonLoader = (env: Environment): MicroframeworkLoader => {
  return (settings: MicroframeworkSettings) => {
    winston.configure({
      level: env.log.level,
      transports: [new winston.transports.Console()],
      format: combine(timestamp(), splat(), format),
    });

    winston.info('Instantiated logger');
  };
};
