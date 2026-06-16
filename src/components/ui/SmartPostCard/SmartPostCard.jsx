import { useRef } from 'react';
import { useSmartPostCardWidth } from '../../../hooks/useSmartPostCardWidth.js';
import TexturedSurface from '../TexturedSurface/TexturedSurface.jsx';
import TitleWithDivider from '../TitleWithDivider/TitleWithDivider.jsx';
import './SmartPostCard.css';

/**
 * Kafelek wpisu z szerokością zależną od liczby zdań i kreską pod tytułem.
 */
export default function SmartPostCard({
  title,
  text,
  surfaceClassName = '',
  innerClassName = '',
  bodyClassName = '',
  titleClassName = '',
  dividerClassName = '',
  textClassName = '',
  titleTag = 'h3',
  trailing = null,
  emptyTitle = 'Bez tytułu',
  emptyText = 'Brak treści.',
}) {
  const innerRef = useRef(null);

  const displayTitle = title?.trim() || emptyTitle;
  const displayText = text?.trim() || emptyText;

  const cardWidth = useSmartPostCardWidth({
    anchorRef: innerRef,
    text: displayText,
  });

  return (
    <TexturedSurface
      className={['smart-post-card', surfaceClassName].filter(Boolean).join(' ')}
      style={cardWidth ? { width: `${cardWidth}px`, maxWidth: '100%' } : { maxWidth: '100%' }}
    >
      <article ref={innerRef} className={innerClassName}>
        <div className={['smart-post-card__body', bodyClassName].filter(Boolean).join(' ')}>
          <TitleWithDivider
            title={displayTitle}
            className={titleClassName}
            dividerClassName={dividerClassName}
            as={titleTag}
            titleDataAttr="data-smart-post-title"
          />
          <p className={textClassName}>{displayText}</p>
        </div>
        {trailing ? (
          <div className="smart-post-card__trailing" data-smart-post-trailing>
            {trailing}
          </div>
        ) : null}
      </article>
    </TexturedSurface>
  );
}
