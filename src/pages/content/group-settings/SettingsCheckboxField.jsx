import AssetSvg from '../../../components/ui/AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../../constants/svgIcons.js';
import '../group-rewards/shared/rewardsModals.css';

/**
 * @param {{
 *   id: string,
 *   checked: boolean,
 *   onChange: (checked: boolean) => void,
 *   children: import('react').ReactNode,
 *   disabled?: boolean,
 * }} props
 */
export default function SettingsCheckboxField({
  id,
  checked,
  onChange,
  children,
  disabled = false,
}) {
  return (
    <label
      className={[
        'rewards-modal__option-label',
        disabled ? 'rewards-modal__option-label--disabled' : '',
      ].filter(Boolean).join(' ')}
      htmlFor={id}
    >
      <input
        id={id}
        type="checkbox"
        className="rewards-modal__option-input"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span
        className={[
          'rewards-modal__option-checkbox',
          checked ? 'rewards-modal__option-checkbox--checked' : '',
        ].filter(Boolean).join(' ')}
        aria-hidden="true"
      >
        {checked ? (
          <AssetSvg name={SVG_ICONS.status.check} width={18} height={18} alt="" />
        ) : null}
      </span>
      <span className="rewards-modal__option-text">{children}</span>
    </label>
  );
}
