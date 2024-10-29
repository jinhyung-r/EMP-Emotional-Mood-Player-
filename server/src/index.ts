import { App } from './app';
import { createLogger } from '@utils/logger';
import config from '@/config';

const logger = createLogger(config);

async function startServer() {
  try {
    const app = App.getInstance();
    const expressApp = await app.initialize();

    expressApp.listen(config.PORT, () => {
      logger.info(`Server is running on port ${config.PORT}`);
      logger.info(`Environment: ${config.NODE_ENV}`);
      logger.info(`Frontend URL: ${config.FRONTEND_URL}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer().catch((error) => {
  logger.error('Unexpected error during server startup:', error);
  process.exit(1);
});
