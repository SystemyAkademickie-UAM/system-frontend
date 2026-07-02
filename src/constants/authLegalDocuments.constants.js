import { publicAssetPath } from '../utils/publicAssetUrl.js';

/** Pliki prawne serwowane z `public/documents/` (URL: `/documents/...`). */
export const AUTH_LEGAL_DOCUMENTS = {
  termsOfUse: {
    label: 'Warunki użytkowania',
    publicPath: 'documents/warunki-uzytkowania.pdf',
    fileName: 'warunki-uzytkowania.pdf',
  },
  privacyPolicy: {
    label: 'Polityka prywatności',
    publicPath: 'documents/polityka-prywatnosci.pdf',
    fileName: 'polityka-prywatnosci.pdf',
  },
};

/** Pełny URL do dokumentu prawnego (uwzględnia `BASE_URL` Vite). */
export function authLegalDocumentUrl(documentKey) {
  return publicAssetPath(AUTH_LEGAL_DOCUMENTS[documentKey].publicPath);
}
