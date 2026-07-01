import { useCallback, useMemo, useState } from 'react';
import { Button, SearchBar } from '../../../components/ui/index.js';
import SmartPostCard from '../../../components/ui/SmartPostCard/SmartPostCard.jsx';
import { DataTableRowActions } from '../../../components/ui/DataTable/DataTable.jsx';
import SectionPageLayout from '../../../components/layout/sectionPage/SectionPageLayout.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import '../../../components/ui/DataTable/DataTable.css';
import '../../../components/page/PageUnavailable.css';
import { useGroupPosts } from './useGroupPosts.js';
import PostFormModal from './PostFormModal.jsx';
import PostDeleteModal from './PostDeleteModal.jsx';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './PostsContent.css';

const PAGETITLE__TEXTLABEL = {
  polish: 'Wpisy',
  english: 'Posts',
};

const ADDPOSTBUTTON__TEXTLABEL = {
  polish: 'Dodaj wpis',
  english: 'Add Post',
};

const SEARCHPLACEHOLDER__TEXTLABEL = {
  polish: 'Szukaj wpisów...',
  english: 'Search posts...',
};

const SEARCH__TEXTLABEL = {
  polish: 'Szukaj wpisów',
  english: 'Search posts',
};

const LOADINGMESSAGE__TEXTLABEL = {
  polish: 'Ładowanie wpisów...',
  english: 'Loading posts...',
};

const NOPOSTSMESSAGE__TEXTLABEL = {
  polish: 'Brak wpisów w tej grupie. Dodaj pierwszy wpis powyżej.',
  english: 'No posts in this group. Add the first post above.',
};

const NOSEARCHRESULTSMESSAGE__TEXTLABEL = {
  polish: 'Brak wyników wyszukiwania.',
  english: 'No search results.',
};

const PUBLISHEDSTATUS__TEXTLABEL = {
  polish: 'Opublikowany',
  english: 'Published',
};

const DRAFTSTATUS__TEXTLABEL = {
  polish: 'Nieopublikowany',
  english: 'Unpublished',
};

const EDITPOST__TEXTLABEL = {
  polish: 'Edytuj wpis',
  english: 'Edit Post',
};

const EDITPOSTDESCRIPTION__TEXTLABEL = {
  polish: 'Zmień temat lub treść wpisu.',
  english: 'Change post title or content.',
};

const DELETEPOST__TEXTLABEL = {
  polish: 'Usuń wpis',
  english: 'Delete Post',
};

const DELETEPOSTDEFAULTTITLE__TEXTLABEL = {
  polish: 'bez tytułu',
  english: 'untitled',
};

function formatPostDate(value) {
  if (!value) return null;
  return new Date(value).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function filterPosts(posts, query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return posts;

  return posts.filter((post) => (
    post.title.toLowerCase().includes(normalized)
    || post.text.toLowerCase().includes(normalized)
  ));
}

export default function PostsContent() {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const nav = useGroupSubNav('group-activities');
  const {
    posts,
    isLoading,
    error,
    createPost,
    updatePost,
    deletePost,
  } = useGroupPosts();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const openModal = useCallback((type, payload = {}) => {
    setActiveModal({ type, ...payload });
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const filteredPosts = useMemo(
    () => filterPosts(posts, searchQuery),
    [posts, searchQuery],
  );

  const postRowActions = useMemo(() => ({
    menuItems: [
      {
        id: 'edit',
        label: EDITPOST__TEXTLABEL[LANGUAGE],
        description: EDITPOSTDESCRIPTION__TEXTLABEL[LANGUAGE],
        onSelect: (post) => openModal('edit', { post }),
      },
    ],
    onDelete: (post) => openModal('delete', { post }),
    deleteLabel: DELETEPOST__TEXTLABEL[LANGUAGE],
    deleteAriaLabel: (post) => `${DELETEPOST__TEXTLABEL[LANGUAGE]} ${post.title || DELETEPOSTDEFAULTTITLE__TEXTLABEL[LANGUAGE]}`,
  }), [openModal, LANGUAGE]);

  const handleCreateConfirm = useCallback(async (values) => {
    setModalLoading(true);
    const result = await createPost(values);
    setModalLoading(false);
    if (result.ok) closeModal();
  }, [createPost, closeModal]);

  const handleEditConfirm = useCallback(async (values) => {
    if (!activeModal?.post) return;
    setModalLoading(true);
    const result = await updatePost(activeModal.post.id, values);
    setModalLoading(false);
    if (result.ok) closeModal();
  }, [activeModal, updatePost, closeModal]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!activeModal?.post) return;
    setModalLoading(true);
    const result = await deletePost(activeModal.post.id);
    setModalLoading(false);
    if (result.ok) closeModal();
  }, [activeModal, deletePost, closeModal]);

  const modalPost = activeModal?.post ?? null;

  return (
    <SectionPageLayout
      className="page-unavailable posts-page"
      title={PAGETITLE__TEXTLABEL[LANGUAGE]}
      subNavItems={nav.items}
      subNavAriaLabel={nav.ariaLabel}
      toolbar={(
        <>
          <div className="maq-section-page__toolbar-start">
            <Button
              variant="primary"
              size="md"
              onClick={() => openModal('create')}
            >
              {ADDPOSTBUTTON__TEXTLABEL[LANGUAGE]}
            </Button>
          </div>
          <div className="maq-section-page__toolbar-end">
            <SearchBar
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={SEARCHPLACEHOLDER__TEXTLABEL[LANGUAGE]}
              name="posts-search"
              className="posts-page__search"
              aria-label={SEARCH__TEXTLABEL[LANGUAGE]}
            />
          </div>
        </>
      )}
    >
      {error ? (
        <p className="posts-page__error" role="alert">{error}</p>
      ) : null}

      {isLoading ? (
        <p className="posts-page__loading page-unavailable__notice">{LOADINGMESSAGE__TEXTLABEL[LANGUAGE]}</p>
      ) : filteredPosts.length === 0 ? (
        <p className="posts-page__empty page-unavailable__notice">
          {posts.length === 0
            ? NOPOSTSMESSAGE__TEXTLABEL[LANGUAGE]
            : NOSEARCHRESULTSMESSAGE__TEXTLABEL[LANGUAGE]}
        </p>
      ) : (
        <div className="posts-islands">
          {filteredPosts.map((post) => {
            const publishedLabel = formatPostDate(post.publishedAt || post.createdAt);

            return (
            <SmartPostCard
              key={`post-${post.id}`}
              title={post.title}
              text={post.text}
              surfaceClassName="posts-island"
              innerClassName="posts-island__inner"
              bodyClassName="posts-island__content"
              titleClassName="posts-island__title"
              dividerClassName="posts-island__divider"
              textClassName="posts-island__text"
              trailing={(
                <div className="posts-island__meta">
                  <div className="posts-island__status-row">
                    {publishedLabel ? (
                      <time className="posts-island__date" dateTime={post.publishedAt || post.createdAt}>
                        {publishedLabel}
                      </time>
                    ) : null}
                    <span
                      className={[
                        'posts-island__status',
                        post.isPublished ? 'posts-island__status--published' : 'posts-island__status--draft',
                      ].join(' ')}
                    >
                      {post.isPublished ? PUBLISHEDSTATUS__TEXTLABEL[LANGUAGE] : DRAFTSTATUS__TEXTLABEL[LANGUAGE]}
                    </span>
                  </div>
                  <div className="posts-island__actions">
                    <DataTableRowActions row={post} rowActions={postRowActions} />
                  </div>
                </div>
              )}
            />
            );
          })}
        </div>
      )}

      <PostFormModal
        isOpen={activeModal?.type === 'create'}
        onClose={closeModal}
        onConfirm={handleCreateConfirm}
        isLoading={modalLoading}
      />
      <PostFormModal
        isOpen={activeModal?.type === 'edit'}
        post={modalPost}
        onClose={closeModal}
        onConfirm={handleEditConfirm}
        isLoading={modalLoading}
      />
      <PostDeleteModal
        isOpen={activeModal?.type === 'delete'}
        post={modalPost}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        isLoading={modalLoading}
      />
    </SectionPageLayout>
  );
}
