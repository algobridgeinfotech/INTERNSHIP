export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  SCHOOL_ADMIN = "SCHOOL_ADMIN",
  TEACHER = "TEACHER",
  ACCOUNTANT = "ACCOUNTANT",
  LIBRARIAN = "LIBRARIAN",
  SCHOOL_CONTROLLER = "SCHOOL_CONTROLLER",
  STUDENT = "STUDENT",
  PARENT = "PARENT",
}

export const STAFF_ROLES = [
  UserRole.TEACHER,
  UserRole.ACCOUNTANT,
  UserRole.LIBRARIAN,
  UserRole.SCHOOL_CONTROLLER,
];

export const PERMISSIONS = {
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
  APPROVE: "approve",
  EXPORT: "export",
};
