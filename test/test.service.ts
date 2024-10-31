import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';

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
      data: { id: '1', name: 'test', username: 'test', password: 'test' },
    });
  }
}
