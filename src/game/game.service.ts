import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { v7 as uuid } from 'uuid';
import { Logger } from 'winston';
import {
  CreateGameRequest,
  GameResponse,
  toGameResponse,
} from 'src/model/game.mode';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class GameService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly prismaService: PrismaService,
  ) {}
  async create(user: User, request: CreateGameRequest): Promise<GameResponse> {
    this.logger.debug(`GameService.creare ${JSON.stringify(request)}`);
    const game = await this.prismaService.game.create({
      data: { id: uuid(), user_id: user.id, ...request },
    });
    return toGameResponse(game);
  }
}
