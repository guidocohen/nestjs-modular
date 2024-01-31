import { Module } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { HttpModule, HttpService } from '@nestjs/axios';

const API_KEY = '123456789';
const API_KEY_PROD = 'PROD12121212SA';

@Module({
  imports: [UsersModule, ProductsModule, HttpModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'API_KEY',
      useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY,
    },
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
