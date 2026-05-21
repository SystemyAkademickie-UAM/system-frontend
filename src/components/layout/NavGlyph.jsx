import { useCallback, useState } from 'react';
import { publicAssetPath } from '../../utils/publicAssetUrl.js';
import { NavGlyphFallback } from './navGlyphs.jsx';

/**
 * Renders /public/assets/icons/{id}.icon when available; otherwise shows inline SVG fallback.
 */
export default function NavGlyph({ id }) {
  const [useFallback, setUseFallback] = useState(false);
  const src = publicAssetPath(`assets/icons/${id}.icon`);

  const onError = useCallback(() => {
    setUseFallback(true);
  }, []);

  return (
    <span className="nav-glyph" aria-hidden="true">
      {!useFallback ? (
        <img
          className="nav-glyph__img"
          src={src}
          alt=""
          width={20}
          height={20}
          loading="lazy"
          decoding="async"
          onError={onError}
        />
      ) : null}
      <span className={useFallback ? 'nav-glyph__fallback' : 'nav-glyph__fallback nav-glyph__fallback--hidden'}>
        <NavGlyphFallback id={id} className="nav-glyph__svg" />
      </span>
    </span>
  );
}
