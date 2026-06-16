import { useRef } from 'react';
import { useMeasuredWidth } from '../../../hooks/useMeasuredWidth.js';
import Divider from '../Divider/Divider.jsx';

/**
 * Blok treści z kreską dopasowaną do jego szerokości (np. opis grupy).
 */
export default function ContentWithMeasuredDivider({
  children,
  className = '',
  dividerClassName = '',
  as: ContentTag = 'p',
}) {
  const contentRef = useRef(null);
  const dividerWidth = useMeasuredWidth(contentRef, [children]);

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
