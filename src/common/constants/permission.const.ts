// Quyền truy cập vào trang
export enum ResourceType {
  USER = 'USER',
  ROLE = 'ROLE',
  PRODUCT = 'PRODUCT',
  ORDER = 'ORDER',
  NEWS = 'NEWS',
  PERMISSION = 'PERMISSION',
}

// Quyền hoạt động trong trang
export enum ActionType {
  VIEW = 'VIEW',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  EXPORT = 'EXPORT',
}
