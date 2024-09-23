import dotenv from 'dotenv';
dotenv.config({ path: 'env.development' });
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default prisma;