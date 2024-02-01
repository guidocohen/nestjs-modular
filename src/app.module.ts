import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { enviroments } from 'environments';
import { env } from 'process';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        API_KEY: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_PORT: Joi.number().default(8090),
      }),
    }),
    UsersModule,
    ProductsModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'TASKS',
      useFactory: async (http: HttpService) => {
        const { data } = await lastValueFrom(
          http.get('https://jsonplaceholder.typicode.com/todos'),
        );
        return data;
      },
      inject: [HttpService],
    },
  ],
})
export class AppModule {}
