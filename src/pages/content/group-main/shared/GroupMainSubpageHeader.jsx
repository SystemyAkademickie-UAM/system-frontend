/**
 * Nagłówek podstron /main/* (jak rangi) — eyebrow + tytuł, opcjonalna akcja po prawej.
 *
 * @param {Object} props
 * @param {string} props.eyebrow
 * @param {string} props.title
 * @param {import('react').ReactNode} [props.actions]
 */
export default function GroupMainSubpageHeader({ eyebrow, title, actions }) {
  return (
    <div className="group-main-subpage__title-row">
      <header className="group-main-subpage__page-header">
        <p className="group-main-subpage__eyebrow">{eyebrow}</p>
        <h1 className="group-main-subpage__title">{title}</h1>
      </header>
      {actions ? (
        <div className="group-main-subpage__actions">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
