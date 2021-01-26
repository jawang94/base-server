import { config as configDotenv } from 'dotenv';
import { resolve } from 'path';

switch (process.env.NODE_ENV) {
  case 'production':
    // Production will not work on local as it expects an https:// origin
    break;
  case 'staging':
    console.log("Environment is 'staging'");
    configDotenv({
      path: resolve(__dirname, '../.env.staging'),
    });
    break;
  case 'local':
    console.log("Environment is 'local'");
    configDotenv({
      path: resolve(__dirname, '../.env.local'),
    });
    break;
  default:
    throw new Error(`'NODE_ENV' ${process.env.NODE_ENV} is not handled!`);
}
