import { useRef } from 'react';
import { useMeasuredWidth } from '../../../hooks/useMeasuredWidth.js';
import Divider from '../Divider/Divider.jsx';

/**
 * Tytuł z kreską dopasowaną do jego szerokości.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.className]
 * @param {string} [props.dividerClassName]
 * @param {keyof JSX.IntrinsicElements} [props.as='h3']
 * @param {string} [props.titleDataAttr]
 */
export default function TitleWithDivider({
  title,
  className = '',
  dividerClassName = '',
  as: TitleTag = 'h3',
  titleDataAttr,
}) {
  const titleRef = useRef(null);
  const dividerWidth = useMeasuredWidth(titleRef, [title]);

  return (
    <>
      <TitleTag
        ref={titleRef}
        className={className}
        {...(titleDataAttr ? { [titleDataAttr]: '' } : null)}
      >
        {title}
      </TitleTag>
      <Divider
        className={dividerClassName}
        length={dividerWidth ? `${dividerWidth}px` : undefined}
      />
    </>
  );
}
