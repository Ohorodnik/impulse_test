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
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private jwtService: JwtService,
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

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() body: SignInDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.getUserByEmail(body.email);
    if (!user) {
      throw new BadRequestException(`User with email ${body.email} is not registered`);
    }
    if (!(await this.authService.isCorrectPassword(body.password, user.password, user.salt))) {
      throw new BadRequestException('Wrong password');
    }

    return {
      accessToken: await this.jwtService.signAsync({ sub: user.id, username: user.email }),
    };
  }
}
