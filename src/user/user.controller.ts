import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard) // This route is protected by jwt stategy
@Controller('users')
export class UserController {
  @Get('me')
  getMe(@GetUser() user: User) {
    // The return of GetUser: request.user, is assigned to user
    return user;
  }
}
