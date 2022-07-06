import { Controller, Request, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AADAuthGuard } from './strategy/aad-auth.guard';

import { LocalAuthGuard } from './strategy/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AADAuthGuard)
  @Post('test')
  async test(@Request() req) {
    return this.authService.login(req.user);
  }
  

}
