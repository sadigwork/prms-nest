import { SetMetadata } from '@nestjs/common';

/**
 * مفتاح البيانات الوصفية للإشارة إلى أن النقطة النهائية عامة
 * Metadata key to indicate that an endpoint is public
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * ديكوراتور لوضع علامة على النقطة النهائية كعامة (لا تتطلب مصادقة)
 * Decorator to mark an endpoint as public (does not require authentication)
 *
 * @example
 * @Public()
 * @Get('public-endpoint')
 * getPublicData() {
 *   return { message: 'This is public' };
 * }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/**
 * ديكوراتور بديل مع اسم أكثر وضوحاً
 * Alternative decorator with a clearer name
 */
export const SkipAuth = () => SetMetadata(IS_PUBLIC_KEY, true);

/**
 * ديكوراتور لوضع علامة على النقطة النهائية كخاصة (تتطلب مصادقة)
 * Decorator to mark an endpoint as private (requires authentication)
 *
 * ملاحظة: هذا هو السلوك الافتراضي في NestJS، لكنه مفيد للتوضيح
 * Note: This is the default behavior in NestJS, but useful for clarity
 */
export const Private = () => SetMetadata(IS_PUBLIC_KEY, false);
