import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, User } from '@prisma/client';
import { pbkdf2, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { EnvironmentVariables } from 'src/env.validation';
import { PrismaService } from 'src/prisma/prisma.service';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';
const pbkdf2Promisified = promisify(pbkdf2);

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService<EnvironmentVariables, true>,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  public async getUserByEmail(email: User['email']): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  public async createUser(userData: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({
      data: {
        id: randomUUID(),
        ...userData,
      },
    });
  }

  public async isUserExists(user: Pick<User, 'email'>): Promise<boolean> {
    return this.prismaService.user
      .count({ where: { email: user.email } })
      .then((count) => count > 0);
  }

  public async encryptPassword(
    pwd: string,
    salt: Buffer | null = null,
  ): Promise<{ password: Buffer; salt: Buffer }> {
    const pwdKeylen = this.configService.get('PASSWORD_KEYLEN');
    if (!salt) {
      salt = randomBytes(pwdKeylen);
    }
    const encryptedPwd = await pbkdf2Promisified(
      pwd,
      salt,
      this.configService.get('PASSWORD_ENCRYPT_ITERATIONS'),
      pwdKeylen,
      'sha512',
    );

    return {
      salt,
      password: encryptedPwd,
    };
  }

  public async isCorrectPassword(
    claimedPwd: string,
    realPwd: Buffer,
    salt: Buffer,
  ): Promise<boolean> {
    const { password: encryptedClaimedPwd } = await this.encryptPassword(claimedPwd, salt);
    return timingSafeEqual(encryptedClaimedPwd, realPwd);
  }

  public async verifyJwt(jwt: string): Promise<object> {
    return this.jwtService.verifyAsync<object>(jwt);
  }
}
