import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisOptions } from 'ioredis';

/**
 * خدمة Redis للتخزين المؤقت والتخزين الرئيسي
 * Redis service for caching and primary storage
 */
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;
  private subscriber: Redis;
  private publisher: Redis;

  constructor(private configService: ConfigService) {}

  /**
   * تهيئة خدمة Redis عند بدء التشغيل
   * Initialize Redis service on startup
   */
  async onModuleInit(): Promise<void> {
    try {
      const redisConfig: RedisOptions = {
        host: this.configService.get<string>('REDIS_HOST', 'localhost'),
        port: this.configService.get<number>('REDIS_PORT', 6379),
        password: this.configService.get<string>('REDIS_PASSWORD'),
        db: this.configService.get<number>('REDIS_DB', 0),
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        connectTimeout: 10000,
      };

      // إنشاء عميل Redis الرئيسي
      // Create main Redis client
      this.client = new Redis(redisConfig);

      // إنشاء عميلين منفصلين للنشر والاشتراك
      // Create separate clients for pub/sub
      this.subscriber = new Redis(redisConfig);
      this.publisher = new Redis(redisConfig);

      // معالجة الأخطاء
      // Error handling
      this.client.on('error', (error) => {
        this.logger.error(`Redis client error: ${error.message}`, error.stack);
      });

      this.client.on('connect', () => {
        this.logger.log('Redis client connected successfully');
      });

      this.client.on('ready', () => {
        this.logger.log('Redis client ready');
      });

      // اختبار الاتصال
      // Test connection
      await this.client.ping();
      this.logger.log('Redis service initialized successfully');
    } catch (error) {
      this.logger.error(
        `Failed to initialize Redis: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * تنظيف الموارد عند إيقاف التشغيل
   * Cleanup resources on shutdown
   */
  async onModuleDestroy(): Promise<void> {
    try {
      if (this.client) {
        await this.client.quit();
      }
      if (this.subscriber) {
        await this.subscriber.quit();
      }
      if (this.publisher) {
        await this.publisher.quit();
      }
      this.logger.log('Redis connections closed');
    } catch (error) {
      this.logger.error(`Error closing Redis connections: ${error.message}`);
    }
  }

  /**
   * الحصول على قيمة من Redis
   * Get value from Redis
   *
   * @param key المفتاح
   * @param key The key
   * @returns القيمة المخزنة
   * @returns The stored value
   */
  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      this.logger.error(`Error getting key ${key}: ${error.message}`);
      return null;
    }
  }

  /**
   * الحصول على قيمة وتحويلها إلى JSON
   * Get value and parse as JSON
   *
   * @param key المفتاح
   * @param key The key
   * @returns الكائن المفسر
   * @returns Parsed object
   */
  async getJson<T>(key: string): Promise<T | null> {
    const value = await this.get(key);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch (error) {
      this.logger.error(`Error parsing JSON for key ${key}: ${error.message}`);
      return null;
    }
  }

  /**
   * تخزين قيمة في Redis
   * Store value in Redis
   *
   * @param key المفتاح
   * @param key The key
   * @param value القيمة
   * @param value The value
   * @param ttl وقت الانتهاء بالثواني (اختياري)
   * @param ttl Time to live in seconds (optional)
   */
  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.client.setex(key, ttl, value);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      this.logger.error(`Error setting key ${key}: ${error.message}`);
      throw error;
    }
  }

  /**
   * تخزين كائن JSON في Redis
   * Store JSON object in Redis
   *
   * @param key المفتاح
   * @param key The key
   * @param value الكائن
   * @param value The object
   * @param ttl وقت الانتهاء بالثواني (اختياري)
   * @param ttl Time to live in seconds (optional)
   */
  async setJson(key: string, value: any, ttl?: number): Promise<void> {
    const jsonValue = JSON.stringify(value);
    await this.set(key, jsonValue, ttl);
  }

  /**
   * تخزين قيمة مع وقت انتهاء
   * Store value with expiration
   *
   * @param key المفتاح
   * @param key The key
   * @param seconds وقت الانتهاء بالثواني
   * @param seconds Time to live in seconds
   * @param value القيمة
   * @param value The value
   */
  async setex(key: string, seconds: number, value: string): Promise<void> {
    await this.set(key, value, seconds);
  }

  /**
   * حذف قيمة من Redis
   * Delete value from Redis
   *
   * @param key المفتاح
   * @param key The key
   */
  async del(key: string): Promise<number> {
    try {
      return await this.client.del(key);
    } catch (error) {
      this.logger.error(`Error deleting key ${key}: ${error.message}`);
      return 0;
    }
  }

  /**
   * حذف عدة مفاتيح
   * Delete multiple keys
   *
   * @param keys المفاتيح
   * @param keys The keys
   */
  async delMultiple(keys: string[]): Promise<number> {
    if (keys.length === 0) return 0;

    try {
      return await this.client.del(...keys);
    } catch (error) {
      this.logger.error(`Error deleting multiple keys: ${error.message}`);
      return 0;
    }
  }

  /**
   * التحقق من وجود مفتاح
   * Check if key exists
   *
   * @param key المفتاح
   * @param key The key
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(
        `Error checking existence of key ${key}: ${error.message}`,
      );
      return false;
    }
  }

  /**
   * زيادة قيمة رقمية
   * Increment a numeric value
   *
   * @param key المفتاح
   * @param key The key
   * @param increment قيمة الزيادة (افتراضي 1)
   * @param increment Increment value (default 1)
   */
  async incr(key: string, increment: number = 1): Promise<number> {
    try {
      if (increment === 1) {
        return await this.client.incr(key);
      } else {
        return await this.client.incrby(key, increment);
      }
    } catch (error) {
      this.logger.error(`Error incrementing key ${key}: ${error.message}`);
      return 0;
    }
  }

  /**
   * تقليل قيمة رقمية
   * Decrement a numeric value
   *
   * @param key المفتاح
   * @param key The key
   * @param decrement قيمة النقصان (افتراضي 1)
   * @param decrement Decrement value (default 1)
   */
  async decr(key: string, decrement: number = 1): Promise<number> {
    try {
      if (decrement === 1) {
        return await this.client.decr(key);
      } else {
        return await this.client.decrby(key, decrement);
      }
    } catch (error) {
      this.logger.error(`Error decrementing key ${key}: ${error.message}`);
      return 0;
    }
  }

  /**
   * الحصول على وقت انتهاء المفتاح
   * Get key time to live
   *
   * @param key المفتاح
   * @param key The key
   * @returns الوقت المتبقي بالثواني
   * @returns Remaining time in seconds
   */
  async ttl(key: string): Promise<number> {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      this.logger.error(`Error getting TTL for key ${key}: ${error.message}`);
      return -2; // -2 يعني المفتاح غير موجود
    }
  }

  /**
   * البحث عن مفاتيح باستخدام نمط
   * Find keys using pattern
   *
   * @param pattern النمط
   * @param pattern The pattern
   * @returns المفاتيح المطابقة
   * @returns Matching keys
   */
  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      this.logger.error(
        `Error getting keys for pattern ${pattern}: ${error.message}`,
      );
      return [];
    }
  }

  /**
   * نشر رسالة في قناة
   * Publish message to a channel
   *
   * @param channel القناة
   * @param channel The channel
   * @param message الرسالة
   * @param message The message
   */
  async publish(channel: string, message: string): Promise<number> {
    try {
      return await this.publisher.publish(channel, message);
    } catch (error) {
      this.logger.error(
        `Error publishing to channel ${channel}: ${error.message}`,
      );
      return 0;
    }
  }

  /**
   * الاشتراك في قناة
   * Subscribe to a channel
   *
   * @param channel القناة
   * @param channel The channel
   * @param callback دالة المعالجة
   * @param callback Handler function
   */
  async subscribe(
    channel: string,
    callback: (message: string) => void,
  ): Promise<void> {
    try {
      await this.subscriber.subscribe(channel);
      this.subscriber.on('message', (ch, message) => {
        if (ch === channel) {
          callback(message);
        }
      });
    } catch (error) {
      this.logger.error(
        `Error subscribing to channel ${channel}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * إلغاء الاشتراك من قناة
   * Unsubscribe from a channel
   *
   * @param channel القناة
   * @param channel The channel
   */
  async unsubscribe(channel: string): Promise<void> {
    try {
      await this.subscriber.unsubscribe(channel);
    } catch (error) {
      this.logger.error(
        `Error unsubscribing from channel ${channel}: ${error.message}`,
      );
    }
  }

  /**
   * تخزين في HashSet
   * Store in HashSet
   *
   * @param key مفتاح الـ Hash
   * @param key Hash key
   * @param field الحقل
   * @param field The field
   * @param value القيمة
   * @param value The value
   */
  async hset(key: string, field: string, value: string): Promise<void> {
    try {
      await this.client.hset(key, field, value);
    } catch (error) {
      this.logger.error(
        `Error HSET for key ${key}, field ${field}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * الحصول من HashSet
   * Get from HashSet
   *
   * @param key مفتاح الـ Hash
   * @param key Hash key
   * @param field الحقل
   * @param field The field
   * @returns القيمة
   * @returns The value
   */
  async hget(key: string, field: string): Promise<string | null> {
    try {
      return await this.client.hget(key, field);
    } catch (error) {
      this.logger.error(
        `Error HGET for key ${key}, field ${field}: ${error.message}`,
      );
      return null;
    }
  }

  /**
   * الحصول على كل حقول الـ Hash
   * Get all fields of Hash
   *
   * @param key مفتاح الـ Hash
   * @param key Hash key
   * @returns جميع القيم
   * @returns All values
   */
  async hgetall(key: string): Promise<Record<string, string>> {
    try {
      return await this.client.hgetall(key);
    } catch (error) {
      this.logger.error(`Error HGETALL for key ${key}: ${error.message}`);
      return {};
    }
  }

  /**
   * إضافة إلى القائمة
   * Add to list
   *
   * @param key مفتاح القائمة
   * @param key List key
   * @param value القيمة
   * @param value The value
   * @param side الجانب (left أو right)
   * @param side The side (left or right)
   */
  async listPush(
    key: string,
    value: string,
    side: 'left' | 'right' = 'right',
  ): Promise<void> {
    try {
      if (side === 'left') {
        await this.client.lpush(key, value);
      } else {
        await this.client.rpush(key, value);
      }
    } catch (error) {
      this.logger.error(`Error LPUSH/RPUSH for key ${key}: ${error.message}`);
      throw error;
    }
  }

  /**
   * الحصول من القائمة
   * Get from list
   *
   * @param key مفتاح القائمة
   * @param key List key
   * @param start الفهرس البدائي
   * @param start Start index
   * @param end الفهرس النهائي
   * @param end End index
   * @returns عناصر القائمة
   * @returns List items
   */
  async listRange(
    key: string,
    start: number = 0,
    end: number = -1,
  ): Promise<string[]> {
    try {
      return await this.client.lrange(key, start, end);
    } catch (error) {
      this.logger.error(`Error LRANGE for key ${key}: ${error.message}`);
      return [];
    }
  }

  /**
   * مسح ذاكرة التخزين المؤقت
   * Flush cache
   *
   * @param pattern نمط المفاتيح المراد مسحها (اختياري)
   * @param pattern Pattern of keys to flush (optional)
   */
  async flush(pattern?: string): Promise<void> {
    try {
      if (pattern) {
        const keys = await this.keys(pattern);
        if (keys.length > 0) {
          await this.delMultiple(keys);
        }
      } else {
        await this.client.flushdb();
      }
      this.logger.log(
        `Cache flushed${pattern ? ` for pattern ${pattern}` : ''}`,
      );
    } catch (error) {
      this.logger.error(`Error flushing cache: ${error.message}`);
      throw error;
    }
  }

  /**
   * الحصول على إحصائيات Redis
   * Get Redis statistics
   */
  async getStats(): Promise<Record<string, any>> {
    try {
      const info = await this.client.info();
      const stats: Record<string, any> = {};

      // تحليل معلومات Redis
      // Parse Redis info
      const lines = info.split('\r\n');
      for (const line of lines) {
        if (line && !line.startsWith('#')) {
          const [key, value] = line.split(':');
          if (key && value) {
            stats[key.trim()] = value.trim();
          }
        }
      }

      return stats;
    } catch (error) {
      this.logger.error(`Error getting Redis stats: ${error.message}`);
      return {};
    }
  }
}
