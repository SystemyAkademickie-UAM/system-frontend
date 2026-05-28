import { useCallback, useState } from 'react';
import { SVG_PLACEHOLDER_FILENAME, svgAssetPath, svgPlaceholderPath } from '../../../utils/svgAssetPath.js';
import './AssetSvg.css';

/**
 * Obrazek SVG z public/assets/svg/. Gdy plik nie istnieje, wyświetla placeholder.svg.
 *
 * @param {Object} props
 * @param {string} props.name — nazwa pliku w public/assets/svg/ (np. "rocket.svg")
 * @param {'mask' | 'original'} [props.tone='mask'] — mask: kolor z tokenów CSS; original: plik bez przekolorowania
 * @param {string} [props.className]
 * @param {number} [props.width]
 * @param {number} [props.height]
 * @param {string} [props.alt='']
 */
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
  const [src, setSrc] = useState(() => (
    name ? svgAssetPath(name) : placeholderSrc
  ));

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
          data-asset-name={name ?? SVG_PLACEHOLDER_FILENAME}
          {...rest}
        />
      </>
    );
  }

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
      data-asset-name={name ?? SVG_PLACEHOLDER_FILENAME}
      {...rest}
    />
  );
}
