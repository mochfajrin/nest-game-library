import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';

export const Role = Reflector.createDecorator<UserRole[]>();
