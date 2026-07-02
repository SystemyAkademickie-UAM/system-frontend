import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../../../auth/browserIdStorage.js';
import { useToast } from '../../../components/ui/Toast/Toast.jsx';

/**
 * @typedef {Object} GroupPost
 * @property {number} id
 * @property {string} title
 * @property {string} text
 */

async function requestJson(path, options = {}) {
  const base = getApiBaseUrl();
  const browserid = getOrCreateBrowserId();

  const response = await fetch(`${base}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Browser-ID': browserid,
      ...options.headers,
    },
    ...options,
  });

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || `Błąd HTTP ${response.status}`);
  }

  return data;
}

function mapPost(raw) {
  return {
    id: raw.id,
    title: raw.title ?? '',
    text: raw.content ?? raw.text ?? '',
    isPublished: raw.isPublished !== false,
    publishedAt: raw.publishedAt ?? null,
    publishAt: raw.publishAt ?? null,
    createdAt: raw.createdAt ?? null,
  };
}
function sortPostsNewestFirst(posts) {
  return [...posts].sort((a, b) => b.id - a.id);
}

export function useGroupPosts() {
  const { groupId } = useParams();
  const { showSuccess, showError } = useToast();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async () => {
    if (!groupId) {
      setError('Brak ID grupy');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await requestJson(`/groups/${groupId}/post`, { method: 'GET' });
      const received = sortPostsNewestFirst((data?.posts ?? []).map(mapPost));
      setPosts(received);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  }, [groupId, showError]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const createPost = useCallback(async ({
    title,
    text,
    startHidden = false,
    schedulePublish = false,
    publishAt = null,
    isPublished = true,
  }) => {
    if (!groupId) return { ok: false, error: 'Brak ID grupy' };

    try {
      const createBody = { title, content: text };

      if (schedulePublish && publishAt) {
        createBody.publishAt = publishAt;
      } else if (!startHidden) {
        createBody.publishAt = new Date().toISOString();
      }

      const data = await requestJson(`/groups/${groupId}/post`, {
        method: 'POST',
        body: JSON.stringify(createBody),
      });

      const postId = data?.post;
      if (typeof postId !== 'number' || postId <= 0) {
        throw new Error('Nie udało się utworzyć wpisu.');
      }

      showSuccess('Wpis został dodany.');
      await fetchPosts();
      return { ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      showError(message);
      return { ok: false, error: message };
    }
  }, [groupId, fetchPosts, showSuccess, showError]);

  const updatePost = useCallback(async (postId, {
    title,
    text,
    startHidden = false,
    schedulePublish = false,
    publishAt = null,
    isPublished,
  }) => {
    if (!groupId) return { ok: false, error: 'Brak ID grupy' };

    try {
      const patchBody = { title, content: text };

      if (schedulePublish && publishAt) {
        patchBody.isPublished = false;
        patchBody.publishAt = publishAt;
      } else if (startHidden) {
        patchBody.isPublished = false;
        patchBody.publishAt = null;
      } else if (isPublished === false) {
        patchBody.isPublished = false;
        patchBody.publishAt = null;
      } else {
        patchBody.isPublished = true;
        patchBody.publishAt = null;
      }

      const data = await requestJson(`/groups/${groupId}/post/${postId}`, {
        method: 'PATCH',
        body: JSON.stringify(patchBody),
      });

      if (data?.updated === false) {
        throw new Error('Nie udało się zapisać zmian wpisu.');
      }

      showSuccess('Wpis został zaktualizowany.');
      await fetchPosts();
      return { ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      showError(message);
      return { ok: false, error: message };
    }
  }, [groupId, fetchPosts, showSuccess, showError]);

  const deletePost = useCallback(async (postId) => {
    if (!groupId) return { ok: false, error: 'Brak ID grupy' };

    const previousPosts = posts;
    setPosts((prev) => prev.filter((post) => post.id !== postId));

    try {
      const data = await requestJson(`/groups/${groupId}/post/${postId}`, {
        method: 'DELETE',
      });

      if (data?.deleted === false) {
        throw new Error('Nie udało się usunąć wpisu.');
      }

      showSuccess('Wpis został usunięty.');
      await fetchPosts();
      return { ok: true };
    } catch (err) {
      setPosts(previousPosts);
      const message = err instanceof Error ? err.message : String(err);
      showError(message);
      return { ok: false, error: message };
    }
  }, [groupId, posts, fetchPosts, showSuccess, showError]);

  return {
    posts,
    isLoading,
    error,
    refetch: fetchPosts,
    createPost,
    updatePost,
    deletePost,
  };
}
