import './PagePlaceholder.css';

/**
 * Bazowy placeholder treści podstrony (do wymiany na realny widok z API).
 * @param {{ name: string }} props
 */
export default function PagePlaceholder({ name }) {
  return (
    <section className="page-placeholder" aria-labelledby="page-placeholder-title">
      <h1 id="page-placeholder-title" className="page-placeholder__title">
        Strona {name}
      </h1>
    </section>
  );
}
