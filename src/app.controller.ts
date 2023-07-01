import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('login')
  root() {
    return null;
  }

  @Get('register')
  @Render('register')
  register() {
    return null;
  }

  @Get('home')
  @Render('home')
  home() {
    return null;
  }
}
