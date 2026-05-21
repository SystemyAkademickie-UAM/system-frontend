import './PageHeader.css';

/**
 * Nagłówek strony + opis podstrony (Figma: Heading 1 + Container).
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {string} [props.className]
 */
export default function PageHeader({ title, description, className = '' }) {
  return (
    <header className={['maq-page-header', className].filter(Boolean).join(' ')}>
      <h1 className="maq-page-header__title">{title}</h1>
      {description ? <p className="maq-page-header__description">{description}</p> : null}
    </header>
  );
}
