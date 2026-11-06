/**
 * @file AssetSvg.jsx
 * @description Komponent interfejsu użytkownika AssetSvg.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { useCallback, useEffect, useState } from 'react';
import {
  resolveSvgAssetName,
  svgAssetPath,
  svgPlaceholderPath,
} from '../../../utils/svgAssetPath.js';
import './AssetSvg.css';

// === STAŁE I ETYKIETY JĘZYKOWE ===
/**
 * Obrazek SVG z public/assets/svg/. Gdy brak pliku lub nieprawidłowa nazwa, wyświetla shared/placeholder.svg.
 *
 * @param {Object} props
 * @param {string} [props.name] — ścieżka względna w public/assets/svg/ (np. "actions/add.svg")
 * @param {'mask' | 'original'} [props.tone='mask'] — mask: kolor z tokenów CSS; original: plik bez przekolorowania
 * @param {string} [props.className]
 * @param {number} [props.width]
 * @param {number} [props.height]
 * @param {string} [props.alt='']
 */

// === GŁÓWNY KOMPONENT WIDOKU ===
export default function AssetSvg({
  name,
  tone = 'mask',
  className = '',
  width,
  height,
  alt = '',
  ...rest
}) {

const placeholderSrc = svgPlaceholderPath();
  const assetName = resolveSvgAssetName(name);
  const [src, setSrc] = useState(() => svgAssetPath(assetName));

  useEffect(() => {
    setSrc(svgAssetPath(assetName));
  }, [assetName]);

  const handleError = useCallback(() => {
    setSrc((current) => (current === placeholderSrc ? current : placeholderSrc));
  }, [placeholderSrc]);

  const classNames = ['maq-asset-svg', tone === 'mask' ? 'maq-asset-svg--mask' : '', className]
    .filter(Boolean)

.join(' ');

  if (tone === 'mask') {
    return (
      <>
        <img
          className="maq-asset-svg__probe"
          src={src}
          alt=""
          aria-hidden="true"
          onError={handleError}
        />
        <span
          className={classNames}
          style={{
            width,
            height,
            '--maq-asset-mask-url': `url("${src}")`,
          }}
          aria-hidden={!alt}
          aria-label={alt || undefined}
          data-asset-name={assetName}
          {...rest}
        />
      </>
    );
  }

// === RENDEROWANIE WIDOKU ===
  return (
    <img
      className={classNames}
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      onError={handleError}
      data-asset-name={assetName}
      {...rest}
    />
  );
}
