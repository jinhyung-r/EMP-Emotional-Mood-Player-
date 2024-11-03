import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { createLogger } from '@utils/logger';
import config from '@/config';
import { SwaggerDefinition } from '@/infrastructure/swagger/types/swagger.types';

const logger = createLogger(config);

export class SwaggerService {
  private static instance: SwaggerService;
  private readonly swaggerSpec: object;

  private constructor() {
    this.swaggerSpec = this.createSwaggerSpec();
  }

  public static getInstance(): SwaggerService {
    if (!SwaggerService.instance) {
      SwaggerService.instance = new SwaggerService();
    }
    return SwaggerService.instance;
  }

  private createSwaggerSpec(): object {
    const swaggerDefinition: SwaggerDefinition = {
      openapi: '3.0.0',
      info: {
        title: 'EMP(Emotional Modd Player) API',
        version: '1.0.0',
        description: '감정/가사 기반 음악 추천 및 플레이리스트 관리 API',
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT',
        },
      },
      servers: [
        {
          url: `http://localhost:${config.PORT}`,
          description: 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          sessionAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'auth_session',
          },
        },
      },
      tags: [
        { name: 'Auth', description: '인증 관련 API' },
        { name: 'Users', description: '사용자 관련 API' },
        { name: 'Playlists', description: '플레이리스트 관련 API' },
      ],
    };

    return swaggerJSDoc({
      swaggerDefinition,
      apis: ['./src/infrastructure/swagger/docs/*.yaml'],
    });
  }

  public setup(app: Express): void {
    if (config.NODE_ENV !== 'production') {
      app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(this.swaggerSpec, {
          customCss: '.swagger-ui .topbar { display: none }',
          customSiteTitle: 'EMP API Documentation',
        }),
      );
      logger.info('Swagger UI initialized at /api-docs');
    }
  }
}

export const swaggerService = SwaggerService.getInstance();
