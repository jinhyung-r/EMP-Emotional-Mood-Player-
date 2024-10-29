import { Router } from 'express';
import { authRouteConfig } from '@/auth/routes/auth.routes';
import { userRouteConfig } from '@/users/routes/user.routes';
import { playlistRoutesConfig } from '@/playlists/routes/playlist.routes';
import { errorMiddleware } from '@/middlewares/error.middleware';
import { createLogger } from '@utils/logger';
import config from '@/config';

const logger = createLogger(config);

export class RouteManager {
  private static instance: RouteManager;
  private readonly router: Router;

  private constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  public static getInstance(): RouteManager {
    if (!RouteManager.instance) {
      RouteManager.instance = new RouteManager();
    }
    return RouteManager.instance;
  }

  private setupRoutes(): void {
    const routes = [authRouteConfig, userRouteConfig, playlistRoutesConfig];

    routes.forEach(({ path, router }) => {
      this.router.use(path, router);
      logger.info(`Route registered: ${path}`);
    });

    // 404 처리
    this.router.use(errorMiddleware.notFound);

    // 에러 처리
    this.router.use(errorMiddleware.handleError);
  }

  public getRouter(): Router {
    return this.router;
  }
}
