import slugify from 'slugify';

export interface GetSlugOptions {
  // Độ dài tối đa của slug. Nếu vượt quá, sẽ cắt ngắn ở dấu phân cách cuối cùng
  truncate?: number;

  //Ký tự được sử dụng làm dấu phân cách (mặc định: '-')
  replacement?: string;
}

/**
 * Convert text to URL-friendly slug
 *
 * @param text - The text to convert to slug
 * @param options - Optional configuration for slug generation
 * @returns URL-friendly slug string
 *
 * @example
 * getSlug('Hello World!') // 'hello-world'
 * getSlug('This is a very long title', { truncate: 10 }) // 'this-is-a'
 * getSlug('Hello World', { replacement: '_' }) // 'hello_world'
 */
export function getSlug(text: string, options?: GetSlugOptions): string {
  const separator = options?.replacement ?? '-';

  let result = slugify(text, {
    remove: /[*+~.()'"!:@,]/g,
    lower: true,
    replacement: separator,
  });

  if (options?.truncate && options.truncate < result.length) {
    const isLucky = result.charAt(options.truncate) === separator;
    result = result.slice(0, options.truncate);

    if (!isLucky) {
      const lastSeparatorIndex = result.lastIndexOf(separator);
      result =
        lastSeparatorIndex > 0 ? result.slice(0, lastSeparatorIndex) : result;
    }
  }

  return result;
}
