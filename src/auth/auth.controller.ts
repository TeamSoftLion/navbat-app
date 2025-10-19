import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  async sendOtp(@Body('phone') phone: string) {
    return await this.authService.sendOtp(phone);
  }
  @Post('verify-otp')
  async verifyOtp(@Body('phone') phone: string, @Body('code') code: string) {
    return await this.authService.verifyOtp(phone, code);
  }
}
