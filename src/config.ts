import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    database: {
      name: process.env.DB_NAME,
      port: process.env.DB_PORT,
    },
    apiKey: process.env.API_KEY,
  };
});
