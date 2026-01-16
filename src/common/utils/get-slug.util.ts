import slugify from 'slugify';

// 1. Định nghĩa Interface cho options để code gợi ý xịn hơn
interface SlugOptions {
  truncate?: number; // Độ dài tối đa muốn cắt
  replacement?: string; // Ký tự thay thế khoảng trắng (mặc định là -)
}

export function getSlug(text: string, options?: SlugOptions): string {
  // Nếu text rỗng hoặc undefined thì trả về rỗng ngay
  if (!text) return '';

  const separator = options?.replacement ?? '-';

  // 2. SỬA LỖI QUAN TRỌNG: Dùng 'let' để có thể thay đổi giá trị biến result
  let result: string = slugify(text, {
    replacement: separator,
    remove: /[*+~.()'"!:@,]/g,
    lower: true, // Chữ thường
    strict: true, // Loại bỏ ký tự lạ
    locale: 'vi', // Hỗ trợ Tiếng Việt
  });

  // 3. Logic cắt chuỗi (Truncate) an toàn
  if (options?.truncate && result.length > options.truncate) {
    // Cắt thô
    const rawTruncated = result.slice(0, options.truncate);

    // Kiểm tra ký tự tiếp theo có phải là dấu gạch ngang không
    // Nếu có, nghĩa là ta cắt đúng điểm đẹp (lucky). Nếu không, ta đang cắt giữa chừng từ.
    const nextChar = result.charAt(options.truncate);
    const isLucky = nextChar === separator || nextChar === '';

    if (isLucky) {
      result = rawTruncated;
    } else {
      // Tìm vị trí dấu gạch ngang gần nhất để cắt lùi lại cho đẹp
      const lastSeparator = rawTruncated.lastIndexOf(separator);
      if (lastSeparator > -1) {
        result = rawTruncated.slice(0, lastSeparator);
      } else {
        // Trường hợp 1 từ quá dài, đành cắt thô
        result = rawTruncated;
      }
    }
  }

  return result;
}
