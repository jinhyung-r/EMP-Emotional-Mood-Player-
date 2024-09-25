import dotenv from 'dotenv';
dotenv.config({ path: 'env.development' });
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function connectToDatabase() {
  try {
    await prisma.$connect();
    console.log('데이터베이스 연결 성공');
  } catch (error) {
    console.error('데이터베이스 연결 실패:', error);
  }
}

connectToDatabase();

export default prisma;
