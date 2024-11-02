import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      method: RequestMethod.POST,
      path: '/api/v1/games',
    });
  }
}
