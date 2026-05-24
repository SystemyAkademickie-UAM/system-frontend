import PageAvailable from '../../../components/page/PageAvailable.jsx';
import PostsContent from './PostsContent.jsx';

export default function PostsHomeContent() {
  return (
    <PageAvailable
      title="Wpisy"
      description="Twórz i edytuj fabularne wpisy oraz ogłoszenia widoczne dla uczestników grupy."
    >
      <PostsContent />
    </PageAvailable>
  );
}
