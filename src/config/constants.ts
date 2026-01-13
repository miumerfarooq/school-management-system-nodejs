export const CONSTANTS = {
  // Pagination
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,

  // Password
  MIN_PASSWORD_LENGTH: 8,
  BCRYPT_SALT_ROUNDS: 10,

  // File Upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],

  // HTTP Status Codes
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
  },

  // Error Messages
  ERRORS: {
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    NOT_FOUND: 'Resource not found',
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_EXISTS: 'Email already exists',
    INVALID_TOKEN: 'Invalid or expired token',
    VALIDATION_ERROR: 'Validation error',
    SERVER_ERROR: 'Internal server error',
    ROLE_INVALID: 'Invalid role',
    EMAIL_NOT_VERIFIED: 'Please verify your email address before logging in',
    PERMISSION_DENIED: 'You do not have permission to access this resource',
    USER_NOT_FOUND: 'User not found',
    USER_CREATION_FAILED: 'Something went wrong while registering the user',
  },

  ERROR_CODES: {
    // Auth & Security
    UNAUTHORIZED: 'unauthorized',
    FORBIDDEN: 'forbidden',
    INVALID_CREDENTIALS: 'invalid_credentials',
    INVALID_TOKEN: 'invalid_token',
    ACCOUNT_INACTIVE: 'account_inactive',

    // User & Account
    EMAIL_EXISTS: 'email_exists',
    USERNAME_EXISTS: 'username_exists',
    PASSWORD_WEAK: 'password_weak',
    PASSWORD_MISMATCH: 'password_mismatch',
    ROLE_INVALID: 'role_invalid',

    // Resource & Database
    NOT_FOUND: 'not_found',
    DUPLICATE_ENTRY: 'duplicate_entry',
    DEPENDENCY_ERROR: 'dependency_error',
    CONFLICT: 'conflict',

    // File Uploads
    FILE_TOO_LARGE: 'file_too_large',
    INVALID_FILE_TYPE: 'invalid_file_type',
    UPLOAD_FAILED: 'upload_failed',

    // Validation & Requests
    VALIDATION_ERROR: 'validation_error',
    BAD_REQUEST: 'bad_request',
    MAX_LIMIT_EXCEEDED: 'max_limit_exceeded',
    RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',

    // Server/System
    SERVER_ERROR: 'server_error',
    SERVICE_UNAVAILABLE: 'service_unavailable',
    TIMEOUT: 'timeout',
    INTERNAL_SERVER_ERROR: 'internal_server_error',
  },

  // Success Messages
  SUCCESS: {
    LOGIN: 'Login successful',
    LOGOUT: 'Logout successful',
    REGISTER: 'Registration successful',
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
  },
} as const;

// ERRORS: {
//   UNAUTHORIZED: 'Unauthorized access',
//   FORBIDDEN: 'Access forbidden',
//   INVALID_CREDENTIALS: 'Invalid email or password',
//   INVALID_TOKEN: 'Invalid or expired token',
//   ACCOUNT_INACTIVE: 'Account is inactive',
//   EMAIL_EXISTS: 'Email already exists',
//   USERNAME_EXISTS: 'Username already exists',
//   PASSWORD_WEAK: 'Password does not meet requirements',
//   PASSWORD_MISMATCH: 'Passwords do not match',
//   ROLE_INVALID: 'Invalid role',
//   NOT_FOUND: 'Resource not found',
//   DUPLICATE_ENTRY: 'Duplicate entry exists',
//   DEPENDENCY_ERROR: 'Resource has dependencies',
//   CONFLICT: 'Resource conflict',
//   FILE_TOO_LARGE: 'File size exceeds limit',
//   INVALID_FILE_TYPE: 'Invalid file type',
//   UPLOAD_FAILED: 'File upload failed',
//   VALIDATION_ERROR: 'Validation error',
//   BAD_REQUEST: 'Bad request',
//   MAX_LIMIT_EXCEEDED: 'Pagination limit exceeded',
//   RATE_LIMIT_EXCEEDED: 'Too many requests',
//   SERVER_ERROR: 'Internal server error',
//   SERVICE_UNAVAILABLE: 'Service unavailable',
//   TIMEOUT: 'Request timed out',
// }
