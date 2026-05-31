import { useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getApiBaseUrl, getSamlLoginUrl } from '../../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../api-test/mock/browserIdStorage.js';

import { publicIconPath } from '../../../utils/publicAssetUrl.js';

const editicon = publicIconPath('edit-02-svgrepo-com.svg');
const deleteicon = publicIconPath('trash-01-svgrepo-com.svg');
import '../shared/LegacyContentLayout.css';
import './PostsContent.css';

export default function App() {

  const { groupId } = useParams();

  const [errorMessage, setErrorMessage] = useState('');
  const [groupnamevalue, setGroupnamevalue] = useState('');
  const [subjectnamevalue, setSubjectnamevalue] = useState('');
  const [groupnamevalueerror, setGroupnamevalueerror] = useState('');
  const [subjectnamevalueerror, setSubjectnamevalueerror] = useState('');
  const [groupdescriptionvalue, setGroupdescriptionvalue] = useState('');
  const [isVisible, setIsvisible] = useState(true);

  const [bannerFile, setBannerfile] = useState(null);
  const [bannerPreview, setBannerpreview] = useState(null);


  const [tempPosts, setTempPosts] = useState([]);
  const [posts, setPosts] = useState([]);





  async function onFetchPosts() {
    setErrorMessage('');

    try {
      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();
      const url = base + '/groups/' + groupId + '/post';

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        }
      });

      const responsetext = await response.text();

      console.log('GET /groups/' + groupId + '/post: ', response.status);
      console.log('GET /groups/' + groupId + '/post: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/groups/' + groupId + '/post not JSON: ' + responsetext);
      }

      console.log('GET /groups/' + groupId + '/post JSON:', data);

      let receiveddata = data;
      const receivedposts = [];

      let i = 0;

      while (i < receiveddata.posts.length) {

        receivedposts.push({
          id: receiveddata.posts[i].id,
          title: receiveddata.posts[i].title,
          text: receiveddata.posts[i].content,
          editmode: 0
        });

        i = i + 1;
      }

      setPosts(receivedposts);

    } catch (error) {

      let message;

      if (error instanceof Error) {
        message = error.message;
      } else {
        message = String(error);
      }

      setErrorMessage(message);
    }
  }





  async function onCreatePost(post) {
    setErrorMessage('');

    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();
      const url = base + '/groups/' + groupId + '/post';

      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        },
        body: JSON.stringify({
          title: post.title,
          content: post.text
        })
      });

      const responsetext = await response.text();

      console.log('POST /groups/' + groupId + '/post: ', response.status);
      console.log('POST /groups/' + groupId + '/post: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/groups/' + groupId + '/post not JSON: ' + responsetext);
      }

      console.log('POST /groups/' + groupId + '/post JSON:', data);

      onFetchPosts();

    } catch (error) {

      let message;

      if (error instanceof Error) {
        message = error.message;
      } else {
        message = String(error);
      }

      setErrorMessage(message);
    }
  }





  async function onUpdatePost(post) {
    setErrorMessage('');
    try {
      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();
      const url = base + '/groups/' + groupId + '/post/' + post.id;
      const response = await fetch(url, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'X-Browser-ID': browserid },
        body: JSON.stringify({ title: post.title, content: post.text })
      });
      const responsetext = await response.text();
      let data = null;
      try { data = JSON.parse(responsetext); } catch {}
      if (!response.ok || (data && data.updated === false)) {
        setErrorMessage('Nie udało się zapisać zmian wpisu.');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    }
  }

  async function onDeletepostclick(id) {
    setErrorMessage('');

    const previousPosts = posts;
    setPosts(posts.filter((p) => p.id != id));

    try {
      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();
      const url = base + '/groups/' + groupId + '/post/' + id;

      const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid,
        },
      });

      const responsetext = await response.text();
      console.log('DELETE /groups/' + groupId + '/post/' + id + ':', response.status, responsetext);

      let data = null;
      try {
        data = JSON.parse(responsetext);
      } catch {
        // empty body is acceptable
      }

      if (!response.ok || (data && data.deleted === false)) {
        setPosts(previousPosts);
        setErrorMessage('Nie udało się usunąć wpisu.');
        return;
      }

      onFetchPosts();
    } catch (error) {
      setPosts(previousPosts);
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(message);
    }
  }

  function onEditpostclick(id, temporary = 0) {

    if (temporary == 0) {

      const newposts = [];
      let i = 0;

      while (i < posts.length) {

        if (posts[i].id == id) {

          let updatedpost = {id: posts[i].id, title: posts[i].title, text: posts[i].text, editmode: posts[i].editmode};

          if (posts[i].editmode == 0) {
            updatedpost.editmode = 1;
          } else if (posts[i].editmode == 1) {
            updatedpost.editmode = 0;
            onUpdatePost(updatedpost);
          }

          newposts.push(updatedpost);

        } else {
          newposts.push(posts[i]);
        }

        i = i + 1;
      }

      setPosts(newposts);

    } else {

      let movingPost = null;
      const newTemp = [];
      let i = 0;

      while (i < tempPosts.length) {

        if (tempPosts[i].id == id) {
          movingPost = tempPosts[i];
        } else {
          newTemp.push(tempPosts[i]);
        }

        i = i + 1;
      }

      movingPost.editmode = 0;

      onCreatePost(movingPost);

      setTempPosts(newTemp);
    }
  }

  function onPostChange(id, field, value) {

    const newposts = [];
    let i = 0;

    while (i < posts.length) {

      if (posts[i].id == id) {

        let updatedpost = {id: posts[i].id, title: posts[i].title, text: posts[i].text, editmode: posts[i].editmode};

        if (field == 'title') {
          updatedpost.title = value;
        } else if (field == 'text') {
          updatedpost.text = value;
        }

        newposts.push(updatedpost);

      } else {
        newposts.push(posts[i]);
      }

      i = i + 1;
    }

    setPosts(newposts);





    const newtempposts = [];
    i = 0;

    while (i < tempPosts.length) {

      if (tempPosts[i].id == id) {

        let updatedpost = {id: tempPosts[i].id, title: tempPosts[i].title, text: tempPosts[i].text, editmode: tempPosts[i].editmode};

        if (field == 'title') {
          updatedpost.title = value;
        } else if (field == 'text') {
          updatedpost.text = value;
        }

        newtempposts.push(updatedpost);

      } else {
        newtempposts.push(tempPosts[i]);
      }

      i = i + 1;
    }

    setTempPosts(newtempposts);
  }





  function addpost() {

    const newtemp = [];
    let i = 0;

    while (i < tempPosts.length) {
      newtemp.push(tempPosts[i]);
      i = i + 1;
    }

    const newpost = {id: tempPosts.length, title: '', text: '', editmode: 2};

    newtemp.push(newpost);

    setTempPosts(newtemp);
  }





  useEffect(() => {
    onFetchPosts();
  }, []);





  return (
    <section className="legacy-content posts-content" aria-label="Wpisy">
      {errorMessage ? <p className="legacy-content__error" role="alert">{errorMessage}</p> : null}

      {tempPosts.length === 0 ? (
        <div className="legacy-content__actions">
          <button type="button" onClick={addpost} className="posts-content__add-btn">
            + Dodaj wpis
          </button>
        </div>
      ) : null}

      <div className="posts-content__list">

          {[...tempPosts, ...posts].map((post) => (

            post.editmode < 1 ? (


              <article key={'post' + post.id} className="posts-content__card">
                <div className="posts-content__card-body">
                  <h3 className="posts-content__card-title">{post.title || 'Bez tytułu'}</h3>
                  <p className="posts-content__card-text">{post.text || 'Brak treści.'}</p>
                </div>
                <div className="posts-content__actions">
                  <button type="button" onClick={() => onEditpostclick(post.id, 0)} className="posts-content__action-btn" aria-label="Edytuj wpis">
                    <img src={editicon} alt="" />
                  </button>
                  <button type="button" onClick={() => onDeletepostclick(post.id)} className="posts-content__action-btn posts-content__action-btn--danger" aria-label="Usuń wpis">
                    <img src={deleteicon} alt="" />
                  </button>
                </div>
              </article>


            ) : (

              <article key={'post' + post.id} className="posts-content__card posts-content__card--editing">
                <div className="posts-content__card-body">
                  <input
                    onChange={(event) => onPostChange(post.id, 'title', event.target.value)}
                    className="posts-content__input"
                    value={post.title}
                    placeholder="Temat wpisu"
                  />
                  <textarea
                    onChange={(event) => onPostChange(post.id, 'text', event.target.value)}
                    className="posts-content__textarea"
                    value={post.text}
                    placeholder="Treść wpisu"
                  />
                </div>
                <div className="posts-content__actions">
                  <button type="button" onClick={() => onEditpostclick(post.id, post.editmode == 2 ? 1 : 0)} className="posts-content__action-btn posts-content__action-btn--primary" aria-label="Zapisz wpis">
                    <img src={editicon} alt="" />
                  </button>
                  <button type="button" onClick={() => onDeletepostclick(post.id)} className="posts-content__action-btn posts-content__action-btn--danger" aria-label="Usuń wpis">
                    <img src={deleteicon} alt="" />
                  </button>
                </div>
              </article>
            )
          ))}








        </div>
    </section>
  );
}




