import { Logger } from 'winston';
import * as bcrypt from 'bcrypt';
import { v7 as uuid } from 'uuid';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  UserResponse,
} from 'src/model/user.model';
import { PrismaService } from 'src/common/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.debug(`Register new user ${JSON.stringify(request)}`);

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
  async login(request: LoginUserRequest): Promise<UserResponse> {
    this.logger.debug(`UserService.login(${JSON.stringify(request)})`);
    const user = await this.prismaService.user.findUnique({
      where: { username: request.username },
    });

    if (!user) {
      throw new UnauthorizedException({
        message: ['Username or Password is invalid'],
      });
    }

    const isPasswordValid = await bcrypt.compare(
      request.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        message: ['Username or Password is invalid'],
      });
    }

    return {
      username: user.username,
      name: user.name,
      access_token: await this.generateAccessToken(user),
    };
  }
  async generateAccessToken(user: User) {
    const payload = { id: user.id, username: user.username, name: user.name };
    return await this.jwtService.signAsync(payload);
  }
  async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    this.logger.debug(`UserService.update ${JSON.stringify(request)}`);

    if (request.name) {
      user.name = request.name;
    }
    if (request.password) {
      user.password = await bcrypt.hash(
        request.password,
        Number(this.configService.get('BCRYPT_ROUNDS')),
      );
    }
    const updatedUser = await this.prismaService.user.update({
      data: user,
      where: { id: user.id },
    });

    return {
      name: updatedUser.name,
      username: updatedUser.name,
      access_token: await this.generateAccessToken(updatedUser),
    };
  }
}
