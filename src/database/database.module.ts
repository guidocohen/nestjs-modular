import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongoClient } from 'mongodb';
import { MongooseModule } from '@nestjs/mongoose';

import config from '../config';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigType<typeof config>) => {
        const { connection, user, password, host, dbName } =
          configService.mongo;
        return {
          uri: `${connection}://${host}`,
          user,
          pass: password,
          dbName,
        };
      },
      inject: [config.KEY],
    }),
  ],
  providers: [
    {
      provide: 'API_KEY',
      useValue: (configService: ConfigType<typeof config>) =>
        configService.apiKey,
    },
    {
      provide: 'MONGO',
      useFactory: async (configServcie: ConfigType<typeof config>) => {
        const { connection, user, password, host, dbName } =
          configServcie.mongo;
        const uri = `${connection}://${user}:${password}@${host}/?authSource=admin&readPreference=primary`;
        const client = new MongoClient(uri);
        try {
          await client.connect();
          const database = client.db(dbName);
          return database;
        } finally {
          await client.close();
        }
      },
      inject: [config.KEY],
    },
  ],
  exports: ['API_KEY', 'MONGO', MongooseModule],
})
export class DatabaseModule {}
