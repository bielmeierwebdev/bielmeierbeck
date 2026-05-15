import { Injectable } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';

import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  create(data: { username: string; password: string; role?: Role }) {
    return this.prisma.user.create({
      data,
    });
  }
}
