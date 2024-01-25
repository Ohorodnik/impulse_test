import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/sing-up.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.OK)
  async singUp(@Body() body: SignUpDto): Promise<void> {
    if (await this.usersService.isUserExists(body)) {
      throw new ConflictException('User already exists');
    }
    if (body.password !== body.repeatPassword) {
      throw new BadRequestException("Passwords don't match");
    }

    const { salt, password } = await this.authService.encryptPassword(body.password);
    await this.usersService.createUser({
      email: body.email,
      password,
      salt,
    });
  }
}
