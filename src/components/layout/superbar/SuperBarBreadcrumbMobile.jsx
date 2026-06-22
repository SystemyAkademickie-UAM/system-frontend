import SuperBarBreadcrumb from './SuperBarBreadcrumb.jsx';
import './SuperBarBreadcrumbMobile.css';

/**
 * Breadcrumb pod SuperBar na mobile — nad treścią strony.
 *
 * @param {{ groupName: string | null, groupPath: string | null, segments: { label: string, to?: string }[] } | null} props.breadcrumb
 */
export default function SuperBarBreadcrumbMobile({ breadcrumb }) {
  if (!breadcrumb) {
    return null;
  }

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
