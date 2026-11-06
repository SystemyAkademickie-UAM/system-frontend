/**
 * @file ShellIcons.jsx
 * @description Komponent interfejsu użytkownika ShellIcons.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import AssetSvg from '../../ui/AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../../constants/svgIcons.js';

// === GŁÓWNY KOMPONENT WIDOKU ===
export function IconStar({ className }) {

return <AssetSvg name={SVG_ICONS.content.star} className={className} width={20} height={20} alt="" />;
}

export function IconMoney({ className }) {
  return <AssetSvg name={SVG_ICONS.content.money} className={className} width={30} height={30} alt="" />;
}

export function IconSettings({ className }) {
  return <AssetSvg name={SVG_ICONS.content.settings} className={className} width={30} height={30} alt="" />;
}

export function IconInfo({ className }) {
  return <AssetSvg name={SVG_ICONS.content.info} className={className} width={30} height={30} alt="" />;
}

export function IconUserPlaceholder({ className }) {

// === RENDEROWANIE WIDOKU ===
  return <AssetSvg name={SVG_ICONS.content.user} className={className} width={24} height={24} alt="" />;
}
