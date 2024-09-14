import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    // generate hash password
    const hash = await argon.hash(dto.password);

    try {
      // save user to db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hash,
        },
      });

      delete user.hash;

      // return the saved one
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }
  async signin(dto: AuthDto) {
    // find user throught email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // if user don't exist, throw exception
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    // compare password and throw exception
    const match = await argon.verify(user.hash, dto.password);
    if (!match) {
      throw new ForbiddenException('Incorrect credentials');
    }

    delete user.hash;
    // return user
    return user;
  }
}
