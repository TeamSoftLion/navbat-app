import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomInt } from 'crypto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async sendOtp(phone: string) {
    const code = String(randomInt(100000, 999999));
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
    await this.prisma.otpCode.create({ data: { phone, code, expiresAt } });
    console.log(`Otp for ${phone} code ${code}`);
    return { message: 'OTP sent successfully (console)' };
  }

  async verifyOtp(phone: string, code: string) {
    const otp = await this.prisma.otpCode.findFirst({
      where: { phone, code, verified: false },
      orderBy: { createdAt: 'desc' },
    });
    if (!otp) throw new UnauthorizedException('Invalid OTP');
    if (otp.expiresAt < new Date())
      throw new UnauthorizedException('OTP expired');
    let user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await this.prisma.user.create({ data: { phone } });
    }
    await this.prisma.otpCode.update({
      where: { id: otp.id },
      data: { verified: true, userId: user.id },
    });
    const token = await this.jwt.signAsync({
      sub: user.id,
      phone: user.phone,
      role: user.role,
    });
    return { access_token: token, user };
  }
}
