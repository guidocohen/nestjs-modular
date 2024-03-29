import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    apiKey: process.env.API_KEY,
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
    mongo: {
      dbName: process.env.MONGO_DB,
      user: encodeURIComponent(process.env.MONGO_INITDB_ROOT_USERNAME),
      password: encodeURIComponent(process.env.MONGO_INITDB_ROOT_PASSWORD),
      host: process.env.MONGO_HOST,
      connection: process.env.MONGO_CONNECTION,
    },
  };
});
