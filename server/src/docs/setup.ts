import {
    OpenApiGeneratorV3,
    OpenAPIRegistry,
}                           from '@asteasolutions/zod-to-openapi';
import swaggerUi            from 'swagger-ui-express';

import app                  from '../app';

export const registry = new OpenAPIRegistry();

import './all.docs';

export const setupSwageer = (  ) => {
    const generator = new OpenApiGeneratorV3(registry.definitions);
    const doc = generator.generateDocument({
        openapi: '3.0.0',
        info: {
            version: '1.0.0',
            title: 'SIKBEAUTY API',
            description: 'API DOCS',
        },
    });
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(doc));    
};
