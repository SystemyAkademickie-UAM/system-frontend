import AssetSvg from '../AssetSvg/AssetSvg.jsx';
import './IconPicker.css';

/**
 * Siatka wyboru ikony z podglądem grafiki zamiast samego tekstu.
 *
 * @param {Object} props
 * @param {Array<{ id: string, label?: string }>} props.icons
 * @param {string} props.value — wybrany id pliku SVG
 * @param {(iconId: string) => void} props.onChange
 * @param {string} [props.name='icon-picker']
 * @param {string} [props.ariaLabel='Wybierz ikonę']
 */
export default function IconPicker({
  icons = [],
  value,
  onChange,
  name = 'icon-picker',
  ariaLabel = 'Wybierz ikonę',
}) {
  if (icons.length === 0) {
    return <p className="icon-picker__empty">Brak dostępnych ikon.</p>;
  }

  return (
    <div className="icon-picker" role="radiogroup" aria-label={ariaLabel}>
      {icons.map((icon) => {
        const isSelected = value === icon.id;

        return (
          <label
            key={icon.id}
            className={[
              'icon-picker__option',
              isSelected ? 'icon-picker__option--selected' : '',
            ].filter(Boolean).join(' ')}
            title={icon.label || icon.id}
          >
            <input
              type="radio"
              name={name}
              className="icon-picker__input"
              value={icon.id}
              checked={isSelected}
              onChange={() => onChange?.(icon.id)}
            />
            <AssetSvg name={icon.id} className="icon-picker__preview" width={28} height={28} alt="" />
          </label>
        );
      })}
    </div>
  );
}
