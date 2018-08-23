import fs from 'fs';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as pkg from '../package.json';

export type LogLevel = 'debug' | 'info' | 'error' | 'warning' | 'silly';

export class Environment {
  public node: string;

  public app: {
    port: string;
    publicUrl: string;
    name: string;
    version: string;
    description: string;
    hasProxy: boolean;
  };
  public log: {
    level: LogLevel;
  };
  public auth: {
    route: string;
  };
  public swagger: {
    enabled: boolean;
    username: string;
    password: string;
  };

  constructor(environment: string) {
    const rootPath = process.env.PWD || process.cwd();
    const configPath = path.join(rootPath, `.env.${environment}`);
    const baseEnv = fs.existsSync(configPath) ? dotenv.parse(fs.readFileSync(configPath)) : {};

    const getOsEnv = (key: string): string => (process.env[key] as string) || baseEnv[key] || '';
    const toBool = (value: string): boolean => value === 'true';

    const normalizePort = (port: string): number | string | boolean => {
      const parsedPort = parseInt(port, 10);
      if (isNaN(parsedPort)) {
        return port;
      }
      if (parsedPort >= 0) {
        return parsedPort;
      }
      return false;
    };

    const port = normalizePort(getOsEnv('PORT')) || '3000';
    const publicUrl = getOsEnv('APP_PUBLIC_URL') || `http://localhost:${port}`;

    this.node = environment;
    this.app = Object.freeze({
      publicUrl,
      port: port as string,
      name: getOsEnv('APP_NAME') || (pkg as any).name,
      version: getOsEnv('APP_VERSION') || (pkg as any).version,
      description: (pkg as any).description,
      hasProxy: toBool(getOsEnv('APP_HASPROXY')),
    });

    this.log = Object.freeze({
      level: (getOsEnv('LOG_LEVEL') as LogLevel) || 'info',
    });

    this.auth = Object.freeze({
      route: getOsEnv('AUTH_ROUTE'),
    });

    this.swagger = Object.freeze({
      enabled: !getOsEnv('SWAGGER_ENABLED') || toBool(getOsEnv('SWAGGER_ENABLED')),
      username: getOsEnv('SWAGGER_USERNAME') || 'admin',
      password: getOsEnv('SWAGGER_PASSWORD') || '1234',
    });
  }
}
