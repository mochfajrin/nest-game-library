import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    console.log(token);
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
      request['user'] = user;
    } catch {
      throw new UnauthorizedException({ message: ['Unathorization'] });
    }
    return true;
  }
  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
