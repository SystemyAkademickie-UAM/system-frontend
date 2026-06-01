import AssetSvg from '../AssetSvg/AssetSvg.jsx';
import { SVG_PLACEHOLDER } from '../../../constants/svgIcons.js';
import { resolveSvgAssetName } from '../../../utils/svgAssetPath.js';

export default function BadgeIcon({ iconFile }) {
  const assetName = resolveSvgAssetName(iconFile || SVG_PLACEHOLDER);

  return (
    <div className="maq-badge__icon-circle">
      <AssetSvg
        name={assetName}
        className="maq-badge__icon-svg"
        alt=""
      />
    </div>
  );
}
