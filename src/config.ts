import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    apiKey: process.env.API_KEY,
    mongo: {
      dbName: process.env.MONGO_DB,
      user: encodeURIComponent(process.env.MONGO_INITDB_ROOT_USERNAME),
      password: encodeURIComponent(process.env.MONGO_INITDB_ROOT_PASSWORD),
      port: parseInt(process.env.MONGO_PORT, 10) || 27017,
      host: process.env.MONGO_HOST,
      connection: process.env.MONGO_CONNECTION,
    },
  };
});
