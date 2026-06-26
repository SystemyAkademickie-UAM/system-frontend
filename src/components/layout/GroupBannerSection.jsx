import GroupBanner from '../../pages/content/group-shared/GroupBanner/GroupBanner.jsx';
import { useGroupDetails } from '../../hooks/groups/useGroupDetails.js';

/** Baner grupy współdzielony między widokami studenta (main, sklep, ranking). */
export default function GroupBannerSection({ groupId }) {
  const { group, isLoading, errorMessage } = useGroupDetails(groupId);

  return (
    <>
      <GroupBanner
        storyName={group?.storyName}
        description={group?.description}
        bannerUrl={group?.bannerUrl}
        isLoading={isLoading}
        showDescription={false}
      />

      {errorMessage ? (
        <p className="group-main-layout__error" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </>
  );
}
