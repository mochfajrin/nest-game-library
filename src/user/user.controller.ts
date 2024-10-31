import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ValidationPipe } from 'src/common/validation.pipe';
import { RegisterUserRequest, UserResponse } from 'src/model/user.model';
import { WebResponse } from 'src/model/web.response';
import { UserValidation } from './user.validation';
import { UserService } from './user.service';

@Controller('/api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
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
}
