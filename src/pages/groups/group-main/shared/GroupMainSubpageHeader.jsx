/**
 * @file GroupMainSubpageHeader.jsx
 * @description Główny komponent widoku strony dla obszaru GroupMainSubpageHeader.
 */

// === IMPORTY I ZALEŻNOŚCI ===
/**
 * Nagłówek podstron /main/* (jak rangi) — eyebrow + tytuł, opcjonalna akcja po prawej.
 *
 * @param {Object} props
 * @param {string} props.eyebrow
 * @param {string} props.title
 * @param {import('react').ReactNode} [props.actions]
 */

// === GŁÓWNY KOMPONENT WIDOKU ===
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
