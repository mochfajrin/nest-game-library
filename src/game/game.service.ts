import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
  CreateGameRequest,
  GameResponse,
  toGameResponse,
} from 'src/model/game.mode';
import { v7 as uuid } from 'uuid';
import { Logger } from 'winston';

@Injectable()
export class GameService {
  constructor(
    private readonly logger: Logger,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly prismaClient: PrismaClient,
  ) {}
  async create(user: User, request: CreateGameRequest): Promise<GameResponse> {
    this.logger.debug(`GameService.creare ${JSON.stringify(request)}`);
    const game = await this.prismaClient.game.create({
      data: { id: uuid(), user_id: user.id, ...request },
    });
    return toGameResponse(game);
  }
}
