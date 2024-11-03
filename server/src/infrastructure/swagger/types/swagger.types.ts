export interface SwaggerDefinition {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
    license: {
      name: string;
      url: string;
    };
  };
  servers: Array<{
    url: string;
    description: string;
  }>;
  components: {
    securitySchemes: {
      sessionAuth: {
        type: string;
        in: string;
        name: string;
      };
    };
  };
  tags: Array<{
    name: string;
    description: string;
  }>;
}
