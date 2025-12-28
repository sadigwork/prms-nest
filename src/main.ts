import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AppConfig } from './shared/config/configuration';
import { I18nService } from './modules/i18n/i18n.service';
import { ValidationWithI18nPipe } from './core/pipes/validation-with-i18n.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const i18nService = app.get(I18nService);
  const appConfig = configService.get<AppConfig>('app');

  // دعم ملفات تعريف الارتباط
  app.use(cookieParser());

  // Global validation pipe مع دعم الترجمة
  // app.useGlobalPipes(new ValidationWithI18nPipe(i18nService));

  // Global validation pipe
  app.useGlobalPipes(
    // new ValidationPipe({
    new ValidationWithI18nPipe({
      i18nService,
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global prefix
  app.setGlobalPrefix(appConfig.apiPrefix);

  // Swagger مع دعم متعدد اللغات
  const config = new DocumentBuilder()
    .setTitle('نظام التسجيل المهني للمهندسين والتقنيين الزراعيين')
    .setDescription(
      'Professional Registry System for Agricultural Engineers and Technicians',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addGlobalParameters({
      name: 'Accept-Language',
      in: 'header',
      required: false,
      schema: { default: 'ar', type: 'string' },
      description: 'اختر اللغة (ar/en)',
    })
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('qualifications', 'Academic qualifications')
    .addTag('experiences', 'Professional experiences')
    .addTag('titles', 'Professional titles')
    .addTag('admin', 'Administration endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'نظام التسجيل المهني',
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  // CORS مع إعدادات إضافية
  app.enableCors({
    origin: configService.get('CORS_ORIGIN', '*'),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept-Language',
      'X-Language',
    ],
  });

  await app.listen(appConfig.port);

  console.log(`التطبيق يعمل على: ${await app.getUrl()}`);
  console.log(`وثائق API: ${await app.getUrl()}/api/docs`);
  console.log(`اللغة الافتراضية: ${i18nService.getCurrentLanguage()}`);
}

bootstrap();
