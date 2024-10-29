import { PrismaService } from './prisma';
export { PrismaService } from '@/infrastructure/database/prisma.service';
export const prisma = PrismaService.getInstance();
