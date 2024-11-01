import { z } from 'zod';

export class GameValidation {
  static readonly CREATE = z.object({
    user_id: z.string().min(36).max(36),
    title: z.string().min(1).max(128),
    image: z.string().min(1).max(50).optional(),
    summary: z.string().min(1).max(4000).optional(),
  });
  static readonly UPDATE = z.object({
    title: z.string().min(1).max(128).optional(),
    image: z.string().min(1).max(50).optional(),
    summary: z.string().min(1).max(4000).optional(),
  });
}
