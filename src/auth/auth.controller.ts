import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { SignUpDto } from './dto/sing-up.dto';
import { AuthService } from './auth.service';
import { SignInDto2, signInSchema } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.OK)
  async singUp(@Body() body: SignUpDto): Promise<void> {
    if (await this.authService.isUserExists(body)) {
      throw new ConflictException('User already exists');
    }
    if (body.password !== body.repeatPassword) {
      throw new BadRequestException("Passwords don't match");
    }

    const { salt, password } = await this.authService.encryptPassword(body.password);
    await this.authService.createUser({
      email: body.email,
      password,
      salt,
    });
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(signInSchema))
  async signIn(@Body() body: SignInDto2): Promise<{ accessToken: string }> {
    const user = await this.authService.getUserByEmail(body.email);
    if (!user) {
      throw new BadRequestException(`User with email ${body.email} is not registered`);
    }
    if (!(await this.authService.isCorrectPassword(body.password, user.password, user.salt))) {
      throw new BadRequestException('Wrong password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
