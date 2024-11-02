import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

@Injectable()
export class TestService {
  constructor(private readonly prismaService: PrismaService) {}
  async deleteUser() {
    await this.prismaService.user.deleteMany();
  }
  async createUser() {
    await this.prismaService.user.create({
      data: {
        id: '1',
        name: 'test',
        username: 'test',
        password: await bcrypt.hash('test', Number(process.env.BCRYPT_ROUNDS)),
      },
    });
  }
  async createUserWithRoleAdmin() {
    await this.prismaService.user.create({
      data: {
        id: '2',
        name: 'admin',
        username: 'admin',
        role: UserRole.ADMIN,
        password: await bcrypt.hash('admin', Number(process.env.BCRYPT_ROUNDS)),
      },
    });
  }
  async getOneUser() {
    return await this.prismaService.user.findUnique({
      where: { username: 'test' },
    });
  }
  async deleteAllGame() {
    await this.prismaService.game.deleteMany();
  }
}
