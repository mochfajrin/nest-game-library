import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractTokenFromHeader(req);

    if (!token) {
      throw new UnauthorizedException({ message: ['Unauhorization'] });
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      if (!payload) {
        throw new UnauthorizedException({ message: ['Unauhorization'] });
      }

      const user = await this.prismaService.user.findUnique({
        where: { username: payload.username },
      });

      if (!user) {
        throw new UnauthorizedException({ message: 'User not found' });
      }
      req['user'] = user;
    } catch {
      throw new UnauthorizedException({ message: ['Unathorization'] });
    }
    next();
  }
  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
