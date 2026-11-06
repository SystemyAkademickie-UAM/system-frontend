/**
 * @file ContentWithMeasuredDivider.jsx
 * @description Komponent interfejsu użytkownika ContentWithMeasuredDivider.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { useRef } from 'react';
import { useMeasuredWidth } from '../../../hooks/useMeasuredWidth.js';
import Divider from '../Divider/Divider.jsx';

// === STAŁE I ETYKIETY JĘZYKOWE ===
/**
 * Blok treści z kreską dopasowaną do jego szerokości (np. opis grupy).
 */

// === GŁÓWNY KOMPONENT WIDOKU ===
export default function ContentWithMeasuredDivider({
  children,
  className = '',
  dividerClassName = '',
  as: ContentTag = 'p',
}) {
  const contentRef = useRef(null);

const dividerWidth = useMeasuredWidth(contentRef, [children]);

// === RENDEROWANIE WIDOKU ===
  return (
    <>
      <ContentTag ref={contentRef} className={className}>
        {children}
      </ContentTag>
      <Divider
        className={dividerClassName}
        length={dividerWidth ? `${dividerWidth}px` : undefined}
      />
    </>
  );
}
