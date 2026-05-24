import { appLogoPath } from '../../../utils/publicAssetUrl.js';
import './AppLogo.css';

/**
 * Logo aplikacji (public/assets/icon/maq.ico).
 *
 * @param {Object} props
 * @param {string} [props.className]
 * @param {number} [props.width=46]
 * @param {number} [props.height=46]
 * @param {string} [props.alt='MyAcademyQuest']
 */
export default function AppLogo({
  className = '',
  width = 46,
  height = 46,
  alt = 'MyAcademyQuest',
}) {
  return (
    <img
      className={['maq-app-logo', className].filter(Boolean).join(' ')}
      src={appLogoPath()}
      alt={alt}
      width={width}
      height={height}
      decoding="async"
    />
  );
}
