import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

import { AppModule } from './app.module';

const { ENV = 'dev', PORT = 8080 } = process.env;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
    });
    app.setGlobalPrefix('api');

    await app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server on http://localhost:${PORT}/api`);
    });
}
bootstrap();
