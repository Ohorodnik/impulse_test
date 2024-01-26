import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  public async getUserById(id: User['id']): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { id } });
  }
}
