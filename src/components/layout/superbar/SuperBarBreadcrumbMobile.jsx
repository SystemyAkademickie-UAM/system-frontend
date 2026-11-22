/**
 * @file SuperBarBreadcrumbMobile.jsx
 * @description Komponent interfejsu użytkownika SuperBarBreadcrumbMobile.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import SuperBarBreadcrumb from './SuperBarBreadcrumb.jsx';
import './SuperBarBreadcrumbMobile.css';

// === STAŁE I ETYKIETY JĘZYKOWE ===
/**
 * Breadcrumb pod SuperBar na mobile — nad treścią strony.
 *
 * @param {{ groupName: string | null, groupPath: string | null, segments: { label: string, to?: string }[] } | null} props.breadcrumb
 */

// === GŁÓWNY KOMPONENT WIDOKU ===
export default function SuperBarBreadcrumbMobile({ breadcrumb }) {
  if (!breadcrumb) {
    return null;
  }

// === RENDEROWANIE WIDOKU ===
  return (
    <div className="super-bar-breadcrumb-mobile">
      <SuperBarBreadcrumb
        homePath={breadcrumb.homePath}
        groupName={breadcrumb.groupName}
        groupPath={breadcrumb.groupPath}
        segments={breadcrumb.segments}
      />
    </div>
  );
}
