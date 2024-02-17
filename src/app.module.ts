import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { HttpModule } from '@nestjs/axios';
import { enviroments } from '../environments';
import { env } from 'process';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import config from './config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'stg').default('dev'),
        PORT: Joi.number().default(3000),
        MONGO_INITDB_ROOT_USERNAME: Joi.string().required(),
        MONGO_INITDB_ROOT_PASSWORD: Joi.string().required(),
        MONGO_DB: Joi.string().required(),
        MONGO_PORT: Joi.number().default(8090),
        MONGO_HOST: Joi.string().required(),
        MONGO_CONNECTION: Joi.string().required(),
        API_KEY: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),
    UsersModule,
    ProductsModule,
    HttpModule,
    DatabaseModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
