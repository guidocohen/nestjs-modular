import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { AuthService } from '../services/auth.service';
import { User } from '../../users/entities/user.entity';
import { Public } from '../decorators/public.decorator';
// import { LoginDto } from '../dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request) {
    const user = req.user as User;
    return this.authService.generateJWT(user);
  }

  /*
  @Post('logins')
  async logins(@Body() login: LoginDto) {
    const { email, password } = login;
    const user = await this.authService.validateUser(email, password);
    const sesion = this.authService.generateJWT(user);
    return sesion;
  }
  */
}
