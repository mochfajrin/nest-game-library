import { Logger } from 'winston';
import * as bcrypt from 'bcrypt';
import { v7 as uuid } from 'uuid';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RegisterUserRequest, UserResponse } from 'src/model/user.model';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.info(`Register new user ${JSON.stringify(request)}`);

    const isUsernameExist = await this.prismaService.user.count({
      where: { username: request.username },
    });

    if (isUsernameExist) {
      throw new BadRequestException({ errors: ['Username alreadt exist'] });
    }

    request.password = await bcrypt.hash(
      request.password,
      Number(this.configService.get('BCRYPT_ROUNDS')),
    );

    const user = await this.prismaService.user.create({
      data: {
        id: uuid(),
        ...request,
      },
    });

    return {
      username: user.username,
      name: user.name,
    };
  }
}
