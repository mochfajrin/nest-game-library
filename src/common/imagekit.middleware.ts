import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import ImageKit from 'imagekit';
import path from 'path';

@Injectable()
export class ImageKitMiddleware implements NestMiddleware {
  private readonly imageKit: ImageKit;
  constructor(private readonly configService: ConfigService) {
    this.imageKit = new ImageKit({
      publicKey: configService.get('IMAGEKIT_PUBLIC_KEY'),
      privateKey: configService.get('IMAGEKIT_PRIVATE_KEY'),
      urlEndpoint: configService.get('IMAGEKIT_URL_ENDPOINT'),
    });
  }
  private async uploadFile(file: Express.Multer.File) {
    const extname = path.extname(file.originalname);
    const result = await this.imageKit.upload({
      file: file.buffer.toString('base64'),
      fileName: `IMG-${Date.now()}.${extname}`,
      folder: 'game-library/thumbnails/',
    });
    return result;
  }
  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.file && !req.body.image_id) {
      return next();
    }
    try {
      if (req.method === 'POST') {
        const result = await this.uploadFile(req.file);
        req.body.image = result.url;
        req.body.image_id = result.fileId;
      } else if (req.method === 'PATCH') {
        await this.imageKit.deleteFile(req.body.image_id);
        if (!req.file) {
          req.body.image = '';
          req.body.image_id = '';
          return next();
        }
        const result = await this.uploadFile(req.file);
        req.body.image = result.url;
        req.body.image_id = result.fileId;
      } else if (req.method === 'DELETE') {
        await this.imageKit.deleteFile(req.body.image_id);
      }
      next();
    } catch (err) {
      throw new BadRequestException({ errors: ['ImageKit Upload Error'] });
    }
  }
}
