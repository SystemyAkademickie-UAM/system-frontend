/** Zgodne z domyślnym limitem backendu (`DRIVE_MAX_FILE_BYTES_DEFAULT`). */
export const GROUP_BANNER_MAX_FILE_BYTES = 4 * 1024 * 1024;

const GROUP_BANNER_MAX_FILE_LABEL = '4 MB';

/**
 * @param {File | null | undefined} file
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateGroupBannerFile(file) {
  if (!file) {
    return { valid: false, error: 'Nie wybrano pliku.' };
  }

  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Dozwolone są wyłącznie pliki graficzne (PNG, JPG, WebP…).' };
  }

  if (file.size > GROUP_BANNER_MAX_FILE_BYTES) {
    return {
      valid: false,
      error: `Plik jest za duży. Maksymalny rozmiar banera to ${GROUP_BANNER_MAX_FILE_LABEL}.`,
    };
  }

  return { valid: true, error: null };
}

export function getGroupBannerMaxFileSizeLabel() {
  return GROUP_BANNER_MAX_FILE_LABEL;
}
