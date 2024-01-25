import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

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
}
