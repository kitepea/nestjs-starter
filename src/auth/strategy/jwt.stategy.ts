import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // Can add 'jwt' here
  constructor(
    config: ConfigService,
    private prisma: PrismaService, // This turn prisma from param to property
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    // console.log(payload);
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    delete user.hash;
    return user;
  }
}
