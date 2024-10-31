import { z } from 'zod';

export class UserValidation {
  static readonly REGISTER = z.object({
    username: z.string().min(4).max(32),
    password: z.string().min(4).max(60),
    name: z.string().min(4).max(50),
  });
  static readonly UPDATE = z.object({
    password: z.string().min(4).max(60),
    name: z.string().min(4).max(50),
  });
  static readonly LOGIN = z.object({
    username: z.string().min(4).max(32),
    password: z.string().min(4).max(60),
  });
}
