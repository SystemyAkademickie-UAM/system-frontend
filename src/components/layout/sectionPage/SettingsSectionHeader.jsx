import './SettingsSectionHeader.css';

/**
 * Nagłówek sekcji na stronach ustawień (np. Ogólne, Awatar).
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.id]
 * @param {string} [props.className]
 */
export default function SettingsSectionHeader({ title, id, className = '' }) {
  return (
    <h2
      id={id}
      className={['settings-section-header', className].filter(Boolean).join(' ')}
    >
      {title}
    </h2>
  );
}
