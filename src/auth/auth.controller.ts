import { Body, Controller, Post, Redirect, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Redirect('/home')
  async register(@Body() user: CreateUserDTO, @Res() res): Promise<void> {
    const jwt = await this.authService.register(user);
    res.cookie('jwt', jwt, { httpOnly: false, secure: true });
  }

  @Post('login')
  @Redirect('/home')
  async login(@Body() user: CreateUserDTO, @Res() res): Promise<void> {
    const jwt = await this.authService.login(user);
    res.cookie('jwt', jwt, { httpOnly: false, secure: true });
  }
}
