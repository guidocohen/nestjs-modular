import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/models/roles.model';
import { PayloadToken } from 'src/auth/models/token.model';
import { OrdersService } from '../services/orders.service';
import { UsersService } from '../services/users.service';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(
    private usersService: UsersService,
    private orderService: OrdersService,
  ) {}

  @Roles(Role.CUSTOMER)
  @Get('my-orders')
  async getOrders(@Req() req: Request) {
    const userToken = req.user as PayloadToken;
    const user = await this.usersService.findOne(userToken.sub);
    console.log('🚀 ~ ProfileController ~ getOrders ~ user:', user);
    return await this.orderService.ordersByCustomer(user.customer.toString());
  }
}
