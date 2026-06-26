/** Maks. długość nazwy (grupa, aktywność, odznaka, ranga, produkt itd.). */
export const NAME_MAX_LENGTH = 64;

/** Maks. długość nazwy waluty grupy. */
export const CURRENCY_LABEL_MAX_LENGTH = NAME_MAX_LENGTH;

/** Maks. długość nazwy żyć grupy (zgodnie z API). */
export const LIVES_LABEL_MAX_LENGTH = 100;

/** Maks. długość nazwy etapu (dodawanie, edycja, kopiowanie). */
export const STAGE_NAME_MAX_LENGTH = 50;

/** Maks. długość krótkiego opisu fabularnego lub dydaktycznego. */
export const SHORT_DESCRIPTION_MAX_LENGTH = 300;

/** Maks. długość opisu grupy. */
export const GROUP_DESCRIPTION_MAX_LENGTH = 500;

/** Maks. długość treści wpisu (tablica ogłoszeń). */
export const POST_CONTENT_MAX_LENGTH = 800;

/** Maks. długość tematu wpisu. */
export const POST_TITLE_MAX_LENGTH = NAME_MAX_LENGTH;

/** @deprecated Użyj NAME_MAX_LENGTH */
export const GROUP_NAME_MAX_LENGTH = NAME_MAX_LENGTH;

/** @deprecated Użyj NAME_MAX_LENGTH */
export const GROUP_SUBJECT_NAME_MAX_LENGTH = NAME_MAX_LENGTH;

/** Maks. długość ksywki użytkownika (rejestracja i ustawienia). */
export const NICKNAME_MAX_LENGTH = 15;

/** @deprecated Użyj NICKNAME_MAX_LENGTH */
export const SETTINGS_NICKNAME_MAX_LENGTH = NICKNAME_MAX_LENGTH;

/** @deprecated Użyj NICKNAME_MAX_LENGTH */
export const PROFILE_NICKNAME_MAX_LENGTH = NICKNAME_MAX_LENGTH;

/** Maks. długość kodu wpisywanego przy dołączaniu do grupy. */
export const ENROLLMENT_ENTRY_CODE_MAX_LENGTH = 6;

/** Presety pól tekstowych dla komponentu TextField. */
export const TEXT_FIELD_PRESETS = {
  name: {
    maxLength: NAME_MAX_LENGTH,
    multiline: false,
  },
  stageName: {
    maxLength: STAGE_NAME_MAX_LENGTH,
    multiline: false,
  },
  shortDescription: {
    maxLength: SHORT_DESCRIPTION_MAX_LENGTH,
    multiline: true,
    rows: 4,
  },
  groupDescription: {
    maxLength: GROUP_DESCRIPTION_MAX_LENGTH,
    multiline: true,
    rows: 5,
  },
  postContent: {
    maxLength: POST_CONTENT_MAX_LENGTH,
    multiline: true,
    rows: 6,
  },
  postTitle: {
    maxLength: POST_TITLE_MAX_LENGTH,
    multiline: false,
  },
};
