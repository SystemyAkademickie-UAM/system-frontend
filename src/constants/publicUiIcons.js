import { publicIconPath } from '../utils/publicAssetUrl.js';

/** URL-e ikon z public/assets/icons/ — nie importować plików z public/ w JS. */
export const PUBLIC_UI_ICONS = {
  edit: publicIconPath('edit-02-svgrepo-com.svg'),
  delete: publicIconPath('trash-01-svgrepo-com.svg'),
  accept: publicIconPath('check-svgrepo-com.svg'),
  cancel: publicIconPath('x-close-svgrepo-com.svg'),
  close: publicIconPath('x-close-svgrepo-com.svg'),
  unlocked: publicIconPath('check-circle-broken-svgrepo-com.svg'),
  locked: publicIconPath('x-circle-svgrepo-com.svg'),
  arrowRight: publicIconPath('arrow-right-svgrepo-com.svg'),
  arrowLeft: publicIconPath('arrow-left-svgrepo-com.svg'),
  arrowCircleRight: publicIconPath('arrow-circle-right-svgrepo-com.svg'),
  info: publicIconPath('info-circle-svgrepo-com.svg'),
  chevronLeft: publicIconPath('chevron-left-svgrepo-com.svg'),
  chevronLeftDouble: publicIconPath('chevron-left-double-svgrepo-com.svg'),
  chevronRight: publicIconPath('chevron-right-svgrepo-com.svg'),
  chevronRightDouble: publicIconPath('chevron-right-double-svgrepo-com.svg'),
};
