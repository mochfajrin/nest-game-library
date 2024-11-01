import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ValidationPipe } from 'src/common/validation.pipe';
import {
  RegisterUserRequest,
  UpdateUserRequest,
  UserPayload,
  UserResponse,
} from 'src/model/user.model';
import { WebResponse } from 'src/model/web.response';
import { UserValidation } from './user.validation';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Auth } from 'src/auth/auth.decorator';
import { User } from '@prisma/client';

@Controller('/api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe(UserValidation.REGISTER))
  async register(
    @Body()
    request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const results = await this.userService.register(request);
    return {
      data: results,
    };
  }
  @Post('/login')
  @HttpCode(200)
  @UsePipes(new ValidationPipe(UserValidation.LOGIN))
  async login(
    @Body()
    request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const results = await this.userService.login(request);
    return {
      data: results,
    };
  }
  @Get('/current')
  @UseGuards(AuthGuard)
  async getCurrent(
    @Auth() user: UserPayload,
  ): Promise<WebResponse<UserResponse>> {
    return {
      data: user,
    };
  }
  @Patch('/current')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @UsePipes(new ValidationPipe(UserValidation.UPDATE))
  async update(
    @Auth() user: User,
    @Body()
    request: UpdateUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const results = await this.userService.update(user, request);
    return {
      data: results,
    };
  }
}
