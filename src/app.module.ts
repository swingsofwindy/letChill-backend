import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './logger/logger.module';
import { ProfileModule } from './profile/profile.module';
import { UsersModule } from './users/users.module';

import { APP_FILTER } from '@nestjs/core';
import * as Joi from 'joi';
import { PrismaClientExceptionFilter } from './common/filters/prisma-exception.filter';
import { LoggingMiddleware } from './common/middlewares/logging.middleware';
import { CustomerModule } from './customer/customer.module';
import { PrismaService } from './database/database.service';
import { ProductModule } from './product/product.module';
import { QuantityCheckModule } from './quantity-check/quantity-check.module';
import { ReceiptModule } from './receipt/receipt.module';
import { ReportModule } from './report/report.module';
import { SaleModule } from './sale/sale.module';
import { StorageModule } from './storage/storage.module';
import { SupplierModule } from './supplier/supplier.module';

@Module({
    imports: [
        DatabaseModule,
        LoggerModule,
        SupplierModule,
        CustomerModule,
        ReceiptModule,
        SaleModule,
        StorageModule,
        AuthModule,
        UsersModule,
        CategoriesModule,
        ReportModule,
        QuantityCheckModule,
        ProfileModule,
        ProductModule,

        ConfigModule.forRoot({
            validationSchema: Joi.object({
                DATABASE_URL: Joi.string().required(),
                JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
                JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
                JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
                JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
            }),
        }),
    ],

    controllers: [AppController],
    providers: [
        AppService,
        PrismaService,
        {
            provide: APP_FILTER,
            useClass: PrismaClientExceptionFilter,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggingMiddleware).forRoutes('*');
    }
}
