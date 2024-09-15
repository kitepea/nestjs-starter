import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';

@Controller('users')
export class UserController {
  @UseGuards(JwtGuard) // This route is protected by jwt stategy
  @Get('me')
  getMe(@Req() req: Request) {
    /*     console.log({
      user: req.user,
    }); */
    return req.user;  // The return of validate in JwtStrategy will be appended to req
  }
}
