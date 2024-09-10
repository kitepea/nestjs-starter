import { Injectable } from '@nestjs/common';
import { User, Bookmark } from '@prisma/client';
@Injectable({})
export class AuthService {
  signup() {
    return { message: 'I am signup' };
  }
  signin() {
    return { message: 'I am signin' };
  }
}
