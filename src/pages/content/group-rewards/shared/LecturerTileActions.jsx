import AssetSvg from '../../../../components/ui/AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../../../constants/svgIcons.js';

function EditIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20h4l10.5-10.5a1.5 1.5 0 0 0 0-2.12L16.62 4.5a1.5 1.5 0 0 0-2.12 0L4 15v5z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M13.5 6.5l4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

/**
 * @param {Object} props
 * @param {string} props.entityLabel — np. „odznakę”, „rangę”
 * @param {string} props.name
 * @param {() => void} [props.onEdit]
 * @param {() => void} [props.onDelete]
 * @param {string} [props.className]
 */
export default function LecturerTileActions({
  entityLabel,
  name,
  onEdit,
  onDelete,
  className = '',
}) {
  return (
    <div className={['maq-product-card__lecturer-actions', className].filter(Boolean).join(' ')}>
      <button
        type="button"
        className="maq-product-card__action-btn"
        aria-label={`Edytuj ${entityLabel} ${name}`}
        onClick={(event) => {
          event.stopPropagation();
          onEdit?.();
        }}
      >
        <EditIcon />
      </button>
      <button
        type="button"
        className="maq-product-card__action-btn maq-product-card__action-btn--danger"
        aria-label={`Usuń ${entityLabel} ${name}`}
        onClick={(event) => {
          event.stopPropagation();
          onDelete?.();
        }}
      >
        <AssetSvg
          name={SVG_ICONS.actions.delete}
          className="maq-product-card__action-icon"
          width={18}
          height={18}
          alt=""
        />
      </button>
    </div>
  );
}
