import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private readonly prismaService: PrismaService) {}
  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: { username: 'test' },
    });
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
  async getOne() {
    return await this.prismaService.user.findUnique({
      where: { username: 'test' },
    });
  }
}
