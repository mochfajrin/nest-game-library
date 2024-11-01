import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ValidationPipe } from 'src/common/validation.pipe';
import { GameValidation } from './game.validation';
import { Auth } from 'src/auth/auth.decorator';
import { CreateGameRequest, GameResponse } from 'src/model/game.mode';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/role/role.guard';
import { Role } from 'src/role/role.decorator';
import { User, UserRole } from '@prisma/client';
import { GameService } from './game.service';
import { WebResponse } from 'src/model/web.response';

@Controller('/api/v1/games')
@UseGuards(RoleGuard)
export class GameController {
  constructor(private readonly gameService: GameService) {}
  @Post()
  @UseGuards(AuthGuard)
  @Role([UserRole.ADMIN])
  @UsePipes(new ValidationPipe(GameValidation.CREATE))
  async create(
    @Auth() user: User,
    @Body() request: CreateGameRequest,
  ): Promise<WebResponse<GameResponse>> {
    const response = await this.gameService.create(user, request);

    return {
      data: response,
    };
  }
}
