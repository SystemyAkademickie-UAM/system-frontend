/** Page size for the organization log and the account list. */
export const ORGANIZATION_ADMIN_PAGE_SIZE = 50;

/** Account API page size. The server allows at most 100. */
export const ORGANIZATION_ACCOUNT_PAGE_SIZE = 100;

/** Import accepts at most this many rows. */
export const ORGANIZATION_ACCOUNT_IMPORT_MAX = 500;

/** Person name, surname, and nickname length accepted by the account API. */
export const ORGANIZATION_ACCOUNT_NAME_MAX_LENGTH = 100;

/** Email length accepted by the account API. */
export const ORGANIZATION_ACCOUNT_EMAIL_MAX_LENGTH = 255;

/** Bytes in one megabyte, used only to print file sizes. */
export const BYTES_PER_MEGABYTE = 1024 * 1024;

/** Printed file size uses this many digits after the decimal point. */
export const FILE_SIZE_FRACTION_DIGITS = 2;

export const ORGANIZATION_LOG_CATEGORY_ALL = 'all';
export const ORGANIZATION_LOG_CATEGORY_ORGANIZATION = 'organization';
export const ORGANIZATION_LOG_CATEGORY_GROUP = 'group';

export const ACCOUNT_ROLE_ALL = 'all';
export const ACCOUNT_ROLE_STUDENT = 'student';
export const ACCOUNT_ROLE_LECTURER = 'lecturer';
export const ACCOUNT_ROLE_ADMINISTRATOR = 'administrator';
export const ACCOUNT_ROLE_SUPER = 'super';

export const LOGIN_METHOD_EMAIL = 'email';

/** People table column widths. The header and body tables size their columns separately, so both need the same widths. */
export const ACCOUNT_COLUMN_WIDTH_PERSON = '20%';
export const ACCOUNT_COLUMN_WIDTH_EMAIL = '26%';
export const ACCOUNT_COLUMN_WIDTH_ROLE = '20%';
export const ACCOUNT_COLUMN_WIDTH_LOGIN_METHOD = '16%';
export const ACCOUNT_COLUMN_WIDTH_CHANGE = '18%';
