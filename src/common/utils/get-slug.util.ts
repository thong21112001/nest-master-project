import slugify from 'slugify';

/**
 * Chuyển đổi chuỗi thành slug URL thân thiện
 * @param text Chuỗi cần chuyển đổi
 * @returns Chuỗi slug (ví dụ: 'hello-world')
 */
export const getSlug = (text: string): string => {
  // 1. Kiểm tra đầu vào an toàn
  if (!text || typeof text !== 'string') {
    return '';
  }

  // 2. Thực hiện convert
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
  const result = slugify(text, {
    lower: true, // Chuyển thành chữ thường
    locale: 'vi', // Hỗ trợ tiếng Việt (đ, ê, ư...)
    strict: true, // Loại bỏ các ký tự đặc biệt
    trim: true, // Xóa khoảng trắng đầu cuối
  });

  return result as unknown as string;
};
