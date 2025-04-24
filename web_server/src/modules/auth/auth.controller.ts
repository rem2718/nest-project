import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './auth.guards';
import { User } from '../user/interfaces/user.interface'; 
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)  
  async login(@Req() req: Request & { user: User }) {
    return this.authService.login(req.user);
  }
}
