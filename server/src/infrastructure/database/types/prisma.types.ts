export interface PrismaLogEvent {
  timestamp: Date;
  query: string;
  params: string;
  duration: number;
  target: string;
}
