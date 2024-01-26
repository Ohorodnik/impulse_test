import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { GuardedRequest } from 'src/auth/interfaces/request.interface';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async getUserData(@Req() req: GuardedRequest): Promise<User> {
    const {
      user: { sub: userId },
    } = req;
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
