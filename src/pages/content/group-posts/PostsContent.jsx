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
import './PostsContent.css';

function filterPosts(posts, query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return posts;

  return posts.filter((post) => (
    post.title.toLowerCase().includes(normalized)
    || post.text.toLowerCase().includes(normalized)
  ));
}

export default function PostsContent() {
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
        label: 'Edytuj wpis',
        description: 'Zmień temat lub treść wpisu.',
        onSelect: (post) => openModal('edit', { post }),
      },
    ],
    onDelete: (post) => openModal('delete', { post }),
    deleteLabel: 'Usuń wpis',
    deleteAriaLabel: (post) => `Usuń wpis ${post.title || 'bez tytułu'}`,
  }), [openModal]);

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
      title="Wpisy"
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
              Dodaj wpis
            </Button>
          </div>
          <div className="maq-section-page__toolbar-end">
            <SearchBar
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Szukaj wpisów…"
              name="posts-search"
              className="posts-page__search"
              aria-label="Szukaj wpisów"
            />
          </div>
        </>
      )}
    >
      {error ? (
        <p className="posts-page__error" role="alert">{error}</p>
      ) : null}

      {isLoading ? (
        <p className="posts-page__loading page-unavailable__notice">Ładowanie wpisów…</p>
      ) : filteredPosts.length === 0 ? (
        <p className="posts-page__empty page-unavailable__notice">
          {posts.length === 0
            ? 'Brak wpisów w tej grupie. Dodaj pierwszy wpis powyżej.'
            : 'Brak wyników wyszukiwania.'}
        </p>
      ) : (
        <div className="posts-islands">
          {filteredPosts.map((post) => (
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
                <div className="posts-island__actions">
                  <DataTableRowActions row={post} rowActions={postRowActions} />
                </div>
              )}
            />
          ))}
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
