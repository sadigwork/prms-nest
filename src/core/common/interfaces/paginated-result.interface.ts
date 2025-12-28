/**
 * واجهة للنتائج المجزأة (Pagination)
 * Interface for paginated results
 *
 * @template T نوع العناصر في الصفيف
 * @template T type of items in the array
 */
export interface PaginatedResult<T> {
  /** البيانات المطلوبة */
  /** Requested data */
  data: T[];

  /** بيانات التعريف الخاصة بالتجزئة */
  /** Pagination metadata */
  meta: {
    /** الصفحة الحالية */
    /** Current page */
    page: number;

    /** عدد العناصر في كل صفحة */
    /** Number of items per page */
    limit: number;

    /** العدد الإجمالي للعناصر */
    /** Total number of items */
    total: number;

    /** العدد الإجمالي للصفحات */
    /** Total number of pages */
    totalPages: number;

    /** هل هناك صفحة سابقة؟ */
    /** Is there a previous page? */
    hasPreviousPage: boolean;

    /** هل هناك صفحة تالية؟ */
    /** Is there a next page? */
    hasNextPage: boolean;
  };

  /** روابط التنقل (اختياري) */
  /** Navigation links (optional) */
  links?: {
    /** رابط الصفحة الأولى */
    /** First page link */
    first: string;

    /** رابط الصفحة السابقة */
    /** Previous page link */
    previous: string | null;

    /** رابط الصفحة الحالية */
    /** Current page link */
    current: string;

    /** رابط الصفحة التالية */
    /** Next page link */
    next: string | null;

    /** رابط الصفحة الأخيرة */
    /** Last page link */
    last: string;
  };
}

/**
 * وظيفة مساعدة لإنشاء نتيجة مجزأة
 * Helper function to create a paginated result
 *
 * @param data البيانات المجزأة
 * @param data Paginated data
 * @param total العدد الإجمالي
 * @param total Total count
 * @param page الصفحة الحالية
 * @param page Current page
 * @param limit عدد العناصر في الصفحة
 * @param limit Items per page
 * @param baseUrl الرابط الأساسي (لإنشاء روابط التنقل)
 * @param baseUrl Base URL (for creating navigation links)
 *
 * @returns نتيجة مجزأة
 * @returns Paginated result
 */
export function createPaginatedResult<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  baseUrl?: string,
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / limit);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  const result: PaginatedResult<T> = {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    },
  };

  // إنشاء روابط التنقل إذا تم توفير baseUrl
  // Create navigation links if baseUrl is provided
  if (baseUrl) {
    const queryParams = new URLSearchParams();

    // إضافة معلمات الاستعلام الحالية (باستثناء page)
    // Add current query parameters (except page)
    Object.entries({ limit }).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.set(key, String(value));
      }
    });

    const baseLink = `${baseUrl}?${queryParams.toString()}`;

    result.links = {
      first: `${baseLink}&page=1`,
      previous: hasPreviousPage ? `${baseLink}&page=${page - 1}` : null,
      current: `${baseLink}&page=${page}`,
      next: hasNextPage ? `${baseLink}&page=${page + 1}` : null,
      last: `${baseLink}&page=${totalPages}`,
    };
  }

  return result;
}

/**
 * واجهة لاستعلام التجزئة
 * Interface for pagination query
 */
export interface PaginationQuery {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
}

/**
 * تحويل PaginationDto إلى PaginationQuery
 * Convert PaginationDto to PaginationQuery
 *
 * @param paginationDto كائن التجزئة
 * @param paginationDto Pagination DTO
 * @param defaultSort الحقل الافتراضي للترتيب
 * @param defaultSort Default sort field
 *
 * @returns استعلام تجزئة
 * @returns Pagination query
 */
export function toPaginationQuery(
  paginationDto: any,
  defaultSort: string = 'createdAt',
): PaginationQuery {
  const page = paginationDto.page || 1;
  const limit = paginationDto.limit || 10;
  const skip = (page - 1) * limit;
  const sortBy = paginationDto.sortBy || defaultSort;
  const sortOrder = paginationDto.sortOrder || 'DESC';

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
}
