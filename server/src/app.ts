import express, { Express } from 'express';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { PrismaService } from '@/infrastructure/database';
import { createSessionStore } from '@/infrastructure/session/sessionStore';
import { configurePassport } from '@/infrastructure/auth/passport.config';
import { RouteManager } from './routes';
import { createLogger } from '@utils/logger';
import config from '@/config';

const logger = createLogger(config);

export class App {
  private static instance: App;
  private readonly app: Express;

  private constructor() {
    this.app = express();
  }

  public static getInstance(): App {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }

  private setupMiddlewares(): void {
    const corsOptions = {
      origin: config.FRONTEND_URL,
      credentials: true,
      optionsSuccessStatus: 200,
    };
    this.app.use(cors(corsOptions));

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser(config.COOKIE_SECRET));

    const sessionConfig = createSessionStore(config);
    this.app.use(session(sessionConfig));

    this.app.use(passport.initialize());
    this.app.use(passport.session());
    configurePassport();
  }

  private setupRoutes(): void {
    const routeManager = RouteManager.getInstance();
    this.app.use('/api', routeManager.getRouter());
  }

  private async connectDatabase(): Promise<void> {
    await PrismaService.connect();
  }

  private setupGracefulShutdown(): void {
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} signal received: closing HTTP server`);
      try {
        await PrismaService.disconnect();
        logger.info('Server closed');
        process.exit(0);
      } catch (error) {
        logger.error('Error during graceful shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('unhandledRejection', (reason: unknown) => {
      logger.error('Unhandled Promise rejection:', reason);
    });

    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });
  }

  public async initialize(): Promise<Express> {
    try {
      await this.connectDatabase();
      this.setupMiddlewares();
      this.setupRoutes();
      this.setupGracefulShutdown();
      return this.app;
    } catch (error) {
      logger.error('Application initialization failed:', error);
      throw error;
    }
  }

  public getExpressApp(): Express {
    return this.app;
  }
}
