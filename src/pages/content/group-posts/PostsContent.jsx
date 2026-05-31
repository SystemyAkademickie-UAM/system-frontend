import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, useToast } from '../../../components/ui/index.js';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../api-test/mock/browserIdStorage.js';
import { publicIconPath } from '../../../utils/publicAssetUrl.js';
import PostFormModal from './PostFormModal.jsx';
import '../shared/LegacyContentLayout.css';
import './PostsContent.css';

const editicon = publicIconPath('edit-02-svgrepo-com.svg');
const deleteicon = publicIconPath('trash-01-svgrepo-com.svg');

export default function PostsContent() {
  const { groupId } = useParams();
  const { showSuccess, showError } = useToast();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const onFetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();
      const response = await fetch(`${base}/groups/${groupId}/post`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid,
        },
      });

      const data = JSON.parse(await response.text());
      setPosts((data.posts ?? []).map((post) => ({
        id: post.id,
        title: post.title,
        text: post.content,
      })));
    } catch {
      showError('Nie udało się pobrać wpisów.');
    } finally {
      setIsLoading(false);
    }
  }, [groupId, showError]);

  useEffect(() => {
    onFetchPosts();
  }, [onFetchPosts]);

  const onCreatePost = async ({ title, text }) => {
    setIsSaving(true);
    try {
      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();
      const response = await fetch(`${base}/groups/${groupId}/post`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid,
        },
        body: JSON.stringify({ title, content: text }),
      });

      if (!response.ok) {
        throw new Error('Nie udało się utworzyć wpisu.');
      }

      showSuccess('Wpis został dodany.');
      setIsCreateOpen(false);
      await onFetchPosts();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Nie udało się utworzyć wpisu.');
    } finally {
      setIsSaving(false);
    }
  };

  const onDeletePost = async (id) => {
    const previousPosts = posts;
    setPosts(posts.filter((post) => post.id !== id));

    try {
      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();
      const response = await fetch(`${base}/groups/${groupId}/post/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid,
        },
      });

      if (!response.ok) {
        setPosts(previousPosts);
        showError('Nie udało się usunąć wpisu.');
        return;
      }

      showSuccess('Wpis został usunięty.');
      await onFetchPosts();
    } catch (error) {
      setPosts(previousPosts);
      showError(error instanceof Error ? error.message : 'Nie udało się usunąć wpisu.');
    }
  };

  const onPostChange = (id, field, value) => {
    setPosts((prev) => prev.map((post) => (
      post.id === id ? { ...post, [field]: value } : post
    )));
  };

  return (
    <section className="legacy-content posts-content" aria-label="Wpisy">
      <div className="legacy-content__actions posts-content__header-actions">
        <Button variant="primary" size="md" onClick={() => setIsCreateOpen(true)}>
          Dodaj wpis
        </Button>
      </div>

      {isLoading ? (
        <p className="legacy-content__message">Ładowanie wpisów…</p>
      ) : posts.length === 0 ? (
        <p className="legacy-content__message">Brak wpisów w tej grupie.</p>
      ) : (
        <div className="posts-content__list">
          {posts.map((post) => (
            editingId === post.id ? (
              <article key={post.id} className="posts-content__card posts-content__card--editing">
                <div className="posts-content__card-body">
                  <input
                    className="posts-content__input"
                    value={post.title}
                    onChange={(event) => onPostChange(post.id, 'title', event.target.value)}
                    placeholder="Temat wpisu"
                  />
                  <textarea
                    className="posts-content__textarea"
                    value={post.text}
                    onChange={(event) => onPostChange(post.id, 'text', event.target.value)}
                    placeholder="Treść wpisu"
                  />
                </div>
                <div className="posts-content__actions">
                  <button
                    type="button"
                    className="posts-content__action-btn posts-content__action-btn--primary"
                    onClick={() => setEditingId(null)}
                  >
                    Gotowe
                  </button>
                </div>
              </article>
            ) : (
              <article key={post.id} className="posts-content__card">
                <div className="posts-content__card-body">
                  <h3 className="posts-content__card-title">{post.title || 'Bez tytułu'}</h3>
                  <p className="posts-content__card-text">{post.text || 'Brak treści.'}</p>
                </div>
                <div className="posts-content__actions">
                  <button
                    type="button"
                    className="posts-content__action-btn"
                    aria-label="Edytuj wpis"
                    onClick={() => setEditingId(post.id)}
                  >
                    <img src={editicon} alt="" />
                  </button>
                  <button
                    type="button"
                    className="posts-content__action-btn posts-content__action-btn--danger"
                    aria-label="Usuń wpis"
                    onClick={() => onDeletePost(post.id)}
                  >
                    <img src={deleteicon} alt="" />
                  </button>
                </div>
              </article>
            )
          ))}
        </div>
      )}

      <PostFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onConfirm={onCreatePost}
        isLoading={isSaving}
      />
    </section>
  );
}
