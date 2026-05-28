import PageAvailable from '../../../components/page/PageAvailable.jsx';
import PostsContent from './PostsContent.jsx';

export default function PostsHomeContent() {
  return (
    <PageAvailable
      title="Wpisy"
      description="Edytor wpisów pozwalający tworzyć historie budujące tło fabularne grupy."
    >
      <PostsContent />
    </PageAvailable>
  );
}
