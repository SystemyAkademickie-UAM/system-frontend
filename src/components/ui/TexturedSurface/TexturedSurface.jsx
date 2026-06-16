import { useId } from 'react';
import './TexturedSurface.css';

/**
 * Tło z „postrzępioną” krawędzią — odpowiednik efektu Figma Texture (radius + size).
 *
 * Zewnętrzna ramka (`frameColor`) otacza panel wewnętrzny (`surfaceColor`).
 * Krawędź panelu jest zniekształcana filtrem SVG (szum + displacement), dzięki czemu
 * ramka prześwituje nieregularnie — jak w Figmie przy radius ≈ 20 i size ≈ 35.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} [props.children]
 * @param {string} [props.className]
 * @param {number} [props.radius=20] — border-radius panelu (px)
 * @param {number} [props.textureSize=35] — siła efektu (feDisplacementMap scale)
 * @param {number} [props.frameInset=7] — minimalna szerokość ramki (px)
 * @param {string} [props.frameColor] — kolor ramki (domyślnie token)
 * @param {string} [props.surfaceColor] — kolor panelu (domyślnie token)
 * @param {boolean} [props.fill=false] — rozciągnij na pełną wysokość rodzica / min-height
 */
export default function TexturedSurface({
  children,
  className = '',
  radius = 20,
  textureSize = 35,
  frameInset = 7,
  frameColor,
  surfaceColor,
  fill = false,
  style: externalStyle,
}) {
  const rawId = useId();
  const filterId = `maq-textured-surface-${rawId.replace(/:/g, '')}`;

  const style = {
    '--texture-radius': `${radius}px`,
    '--texture-displacement': textureSize,
    '--texture-frame-inset': `${frameInset}px`,
    ...(frameColor ? { '--texture-frame-color': frameColor } : null),
    ...(surfaceColor ? { '--texture-surface-color': surfaceColor } : null),
    ...externalStyle,
  };

  return (
    <div
      className={['maq-textured-surface', fill ? 'maq-textured-surface--fill' : '', className]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      <svg className="maq-textured-surface__defs" aria-hidden="true" focusable="false">
        <defs>
          <filter
            id={filterId}
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.045"
              numOctaves="3"
              seed="8"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={textureSize}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div className="maq-textured-surface__panel">
        <div
          className="maq-textured-surface__panel-bg"
          style={{ filter: `url(#${filterId})` }}
          aria-hidden="true"
        />
        <div className="maq-textured-surface__panel-content">
          {children}
        </div>
      </div>
    </div>
  );
}
