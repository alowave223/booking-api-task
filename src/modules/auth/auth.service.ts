import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<{ email: string; sub: number } | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user || !(await bcrypt.compare(pass, user.password))) {
      return null;
    }

    return { email: user.email, sub: user.id };
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };

    return await this.jwtService.signAsync(payload);
  }
}
