import AssetSvg from '../AssetSvg/AssetSvg.jsx';

export default function BadgeIcon({ icon, iconFile }) {
  const assetName = iconFile || 'badge-default.svg';

  return (
    <div className="maq-badge__icon-circle">
      {icon ?? (
        <AssetSvg
          name={assetName}
          className="maq-badge__icon-svg"
          alt=""
        />
      )}
    </div>
  );
}
