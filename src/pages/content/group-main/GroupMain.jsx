import {useCallback, useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {getApiBaseUrl, getSamlLoginUrl} from '../../../constants/api.constants.js';
import {getOrCreateBrowserId} from '../../../auth/browserIdStorage.js';
import {useAppRole} from '../../../context/AppRoleContext.jsx';
import { Button, TexturedSurface, useToast } from '../../../components/ui/index.js';
import {APP_ROLE} from '../../../navigation/shellTemplates.config.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import GroupMainSubpageHeader from './shared/GroupMainSubpageHeader.jsx';
import SmartPostCard from '../../../components/ui/SmartPostCard/SmartPostCard.jsx';

import { PUBLIC_UI_ICONS } from '../../../constants/publicUiIcons.js';
import './shared/groupMainSubpageHeader.css';
import '../group-main/GroupMainHomeContent.css';
import './GroupMain.css';

const editicon = PUBLIC_UI_ICONS.edit;
const deleteicon = PUBLIC_UI_ICONS.delete;
const accepticon = PUBLIC_UI_ICONS.accept;
const cancelicon = PUBLIC_UI_ICONS.cancel;

const ANNOUNCEMENTSBOARD__TEXTLABEL = {
  polish: 'Tablica ogłoszeń',
  english: 'Announcements',
};

const POSTSTITLE__TEXTLABEL = {
  polish: 'Wpisy',
  english: 'Posts',
};

const ADDPOSTBUTTON__TEXTLABEL = {
  polish: 'Dodaj wpis',
  english: 'Add Post',
};

const EMPTYPOSTMESSAGE__TEXTLABEL = {
  polish: 'Brak wpisów w tej grupie.',
  english: 'No posts in this group.',
};

const POSTTITLEPLACEHOLDER__TEXTLABEL = {
  polish: 'Temat wpisu',
  english: 'Post title',
};

const POSTTEXTPLACEHOLDER__TEXTLABEL = {
  polish: 'Treść wpisu',
  english: 'Post content',
};

const SAVEPOST__TEXTLABEL = {
  polish: 'Zapisz wpis',
  english: 'Save post',
};

const CANCELEDIT__TEXTLABEL = {
  polish: 'Anuluj edycję',
  english: 'Cancel edit',
};

const CREATESUCCESS__TEXTLABEL = {
  polish: 'Wpis został utworzony!',
  english: 'Post created!',
};

const CREATEREQUIREDFIELDS__TEXTLABEL = {
  polish: 'Oba pola muszą być wypełnione.',
  english: 'Both fields must be filled.',
};

function isPostFormValid(post) {
  return post.title.trim().length > 0 && post.text.trim().length > 0;
}

export default function App() {

  const {groupId} = useParams();
  const {showSuccess, showError} = useToast();
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

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

  const {role} = useAppRole();



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

      const receivedposts = (data?.posts ?? []).map((post) => ({
        id: post.id,
        title: post.title ?? '',
        text: post.content ?? '',
        publishedAt: post.publishedAt ?? post.createdAt ?? null,
        editmode: 0,
      }));

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
      if (post.title.length > 0 && post.text.length > 0) {
        showSuccess(CREATESUCCESS__TEXTLABEL[LANGUAGE]);
      } else {
        showError(CREATEREQUIREDFIELDS__TEXTLABEL[LANGUAGE]);
      }
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





  async function onDeletepostclick(id) {
    setErrorMessage('');

    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();
      const url = base + '/groups/' + groupId + '/post/' + id;

      const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        }
      });

      const responsetext = await response.text();

      console.log('DELETE /groups/' + groupId + '/post/' + id + ': ', response.status);
      console.log('DELETE /groups/' + groupId + '/post/' + id + ': ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/groups/' + groupId + '/post/' + id + ' not JSON: ' + responsetext);
      }

      console.log('DELETE /groups/' + groupId + '/post/' + id + ' JSON:', data);

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


  function onEditpostclick(id, temporary = 0) {

    if (temporary == 0) {

      const newposts = [];
      let i = 0;

      while (i < posts.length) {

        if (posts[i].id == id) {

          let updatedpost = {id: posts[i].id, title: posts[i].title, text: posts[i].text, editmode: posts[i].editmode};

          if (posts[i].editmode == 0) {
            updatedpost.editmode = 1;
          } else if (posts[i].editmode == 1 && isPostFormValid(posts[i])) {
            updatedpost.editmode = 0;
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

      if (!movingPost || !isPostFormValid(movingPost)) {
        return;
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


  function onCancelpostclick(id) {

    const newtemp = [];
    let i = 0;

    while (i < tempPosts.length) {

      if (tempPosts[i].id != id) {
        newtemp.push(tempPosts[i]);
      }

      i = i + 1;
    }

    setTempPosts(newtemp);
  }


  useEffect(() => {
    if (!groupId) return;
    onFetchPosts();
  }, [groupId]);

  const isLecturer = role === APP_ROLE.LECTURER
    || role === APP_ROLE.ADMIN
    || role === APP_ROLE.SUPERADMIN;

  return (
    <section className="group-main-posts" aria-label="Wpisy">
      <GroupMainSubpageHeader
        eyebrow={ANNOUNCEMENTSBOARD__TEXTLABEL[LANGUAGE]}
        title={POSTSTITLE__TEXTLABEL[LANGUAGE]}
        actions={isLecturer ? (
          <Button
            type="button"
            variant="primary"
            size="md"
            className="group-main-subpage__add-btn"
            onClick={addpost}
          >
            {ADDPOSTBUTTON__TEXTLABEL[LANGUAGE]}
          </Button>
        ) : null}
      />

      {errorMessage ? (
        <p className="group-main-posts__error" role="alert">{errorMessage}</p>
      ) : null}

      <div className="group-main-posts__list">
        {[...tempPosts, ...posts].length === 0 ? (
          <p className="group-main-home__empty-notice">{EMPTYPOSTMESSAGE__TEXTLABEL[LANGUAGE]}</p>
        ) : (
          [...tempPosts, ...posts].map((post) => {
            const canSavePost = isPostFormValid(post);

            const publishedLabel = post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString('pl-PL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
              : null;

            return post.editmode < 1 ? (
              <SmartPostCard
                key={`post${post.id}`}
                title={post.title}
                text={post.text}
                surfaceClassName="group-main-posts__card-surface"
                innerClassName="group-main-posts__card"
                bodyClassName="group-main-posts__card-body"
                titleClassName="group-main-posts__card-title"
                dividerClassName="group-main-posts__card-divider"
                textClassName="group-main-posts__card-text"
                titleTag="h2"
                trailing={publishedLabel ? (
                  <time className="group-main-posts__published-at" dateTime={post.publishedAt}>
                    {publishedLabel}
                  </time>
                ) : null}
              />
            ) : (
              <TexturedSurface key={`post${post.id}`} className="group-main-posts__card-surface">
                <article className="group-main-posts__card">
                  <div className="group-main-posts__edit">
                    <input
                      className="group-main-posts__input"
                      onChange={(event) => onPostChange(post.id, 'title', event.target.value)}
                      value={post.title}
                      placeholder={POSTTITLEPLACEHOLDER__TEXTLABEL[LANGUAGE]}
                    />
                    <textarea
                      className="group-main-posts__textarea"
                      onChange={(event) => onPostChange(post.id, 'text', event.target.value)}
                      value={post.text}
                      placeholder={POSTTEXTPLACEHOLDER__TEXTLABEL[LANGUAGE]}
                    />
                  </div>
                  <div className="group-main-posts__edit-actions">
                    <button
                      type="button"
                      className="group-main-posts__icon-btn"
                      onClick={() => onEditpostclick(post.id, post.editmode === 2 ? 1 : 0)}
                      disabled={!canSavePost}
                      aria-label={SAVEPOST__TEXTLABEL[LANGUAGE]}
                    >
                      <img src={accepticon} alt="" />
                    </button>
                    <button
                      type="button"
                      className="group-main-posts__icon-btn"
                      onClick={() => onCancelpostclick(post.id)}
                      aria-label={CANCELEDIT__TEXTLABEL[LANGUAGE]}
                    >
                      <img src={cancelicon} alt="" />
                    </button>
                  </div>
                </article>
              </TexturedSurface>
            );
          })
        )}
      </div>
    </section>
  );
}
