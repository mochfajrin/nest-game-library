import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ValidationPipe } from 'src/common/validation.pipe';
import { GameValidation } from './game.validation';
import { Auth } from 'src/auth/auth.decorator';
import { CreateGameRequest, GameResponse } from 'src/model/game.mode';
import { RoleGuard } from 'src/role/role.guard';
import { Role } from 'src/role/role.decorator';
import { User, UserRole } from '@prisma/client';
import { GameService } from './game.service';
import { WebResponse } from 'src/model/web.response';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';

@Controller('/api/v1/games')
@UseGuards(RoleGuard)
export class GameController {
  constructor(private readonly gameService: GameService) {}
  @Post()
  @Role([UserRole.ADMIN])
  @UseInterceptors(
    FileInterceptor('image', { storage: multer.memoryStorage() }),
  )
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
