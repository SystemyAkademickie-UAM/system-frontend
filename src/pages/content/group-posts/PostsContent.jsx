import { useCallback, useMemo, useState } from 'react';
import { Button, PageHeader, SearchBar } from '../../../components/ui/index.js';
import { DataTableRowActions } from '../../../components/ui/DataTable/DataTable.jsx';
import '../../../components/ui/DataTable/DataTable.css';
import '../../../components/page/PageUnavailable.css';
import '../shared/groupSectionPage.css';
import '../group-members/MembersHomeContent.css';
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
    <section className="page-unavailable members-page posts-page" aria-label="Wpisy">
      <div className="members-page__header-row">
        <PageHeader
          title="Wpisy"
          description="Edytor wpisów pozwalający tworzyć historie budujące tło fabularne grupy."
        />
        <Button
          variant="primary"
          size="md"
          className="members-page__header-action posts-page__add-btn"
          onClick={() => openModal('create')}
        >
          Dodaj wpis
        </Button>
      </div>

      {error ? (
        <p className="posts-page__error" role="alert">{error}</p>
      ) : null}

      <div className="members-page__nav-row posts-page__controls">
        <span className="posts-page__count">
          Wpisy
          {' '}
          {posts.length}
        </span>

        <SearchBar
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Szukaj wpisów…"
          name="posts-search"
          className="members-page__search posts-page__search"
          aria-label="Szukaj wpisów"
        />
      </div>

      {isLoading ? (
        <p className="posts-page__loading">Ładowanie wpisów…</p>
      ) : filteredPosts.length === 0 ? (
        <p className="posts-page__empty">
          {posts.length === 0
            ? 'Brak wpisów w tej grupie. Dodaj pierwszy wpis powyżej.'
            : 'Brak wyników wyszukiwania.'}
        </p>
      ) : (
        <div className="posts-islands">
          {filteredPosts.map((post) => (
            <article key={`post-${post.id}`} className="posts-island">
              <div className="posts-island__content">
                <h3 className="posts-island__title">
                  {post.title.trim() || 'Bez tytułu'}
                </h3>
                <p className="posts-island__text">
                  {post.text.trim() || 'Brak treści.'}
                </p>
              </div>
              <div className="posts-island__actions">
                <DataTableRowActions row={post} rowActions={postRowActions} />
              </div>
            </article>
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
    </section>
  );
}
