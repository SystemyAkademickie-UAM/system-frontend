import {useCallback, useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {getApiBaseUrl, getSamlLoginUrl} from '../../../constants/api.constants.js';
import {getOrCreateBrowserId} from '../api-test/mock/browserIdStorage.js';
import {useAppRole} from '../../../context/AppRoleContext.jsx';
import {useToast} from '../../../components/ui/index.js';

import { PUBLIC_UI_ICONS } from '../../../constants/publicUiIcons.js';

const editicon = PUBLIC_UI_ICONS.edit;
const deleteicon = PUBLIC_UI_ICONS.delete;
const accepticon = PUBLIC_UI_ICONS.accept;
const cancelicon = PUBLIC_UI_ICONS.cancel;

export default function App() {

  const {groupId} = useParams();
  const {showSuccess, showError} = useToast();

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
      if (post.title.length > 0 && post.text.length > 0) {
        showSuccess('Wpis został utworzony!');
      } else {
        showError('Oba pola muszą być wypełnione.');
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
          } else if (posts[i].editmode == 1) {
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
    onFetchPosts();
  }, []);





  return (
    <div style = {{width: '98%', position: 'absolute', top: '30vh', left: '1%', display: 'flex', flexDirection: 'column', gap: '2.5vh', borderRadius: '16px', paddingTop: '1%', paddingBottom: '1%'}}>
      <div>







        </div>




        {tempPosts.length == 0 && role == 'lecturer' && (<div onClick = {addpost} style = {{backgroundColor: 'rgba(66, 243, 125)', width: '15%', height: '5vh', top: '12.5vh', left: '81.5%', position: 'absolute', borderRadius: '8px', color: 'rgb(0, 57, 21)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer'}}>Dodaj wpis</div>)}





        <div style = {{width: '98%', position: 'absolute', top: '20vh', left: '1%', display: 'flex', flexDirection: 'column', gap: '2.5vh', borderRadius: '16px', paddingTop: '1%', paddingBottom: '1%'}}>



          {[...tempPosts, ...posts].map((post) => (

            post.editmode < 1 ? (


              <div key = {'post' + post.id} style = {{backgroundColor: 'rgb(26, 26, 42)', width: '98%', position: 'relative', left: '1%', display: 'flex', flexDirection: 'row', alignItems: 'center', borderRadius: '16px'}}>
                <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', fontWeight: 500, alignItems: 'flex-start', justifyContent: 'flex-start', gap: '2.5vh'}}>
                  <div onChange = {(event) => onGroupdescriptionchange(event.target.value)} style = {{width: '100%', height: '5vh', left: '0%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '21px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', paddingLeft: '2%', paddingTop: '2%', resize: 'none'}} placeholder = 'Temat wpisu'>{post.title}</div>
                  <div onChange = {(event) => onGroupdescriptionchange(event.target.value)} style = {{width: '100%', left: '0%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '16px', display: 'flex', fontWeight: 500, alignItems: 'flex-start', justifyContent: 'flex-start', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', paddingLeft: '2%', paddingRight: '2%', resize: 'none', paddingBottom: '2%', lineHeight: '1.5'}} placeholder = 'Treść wpisu'>{post.text}</div>
                </div>
              </div>


            ) : (

              <div key = {'post' + post.id} style = {{width: '98%', position: 'relative', left: '1%', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <div style = {{width: '93.5%', height: '25vh', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', fontWeight: 500, alignItems: 'flex-start', justifyContent: 'flex-start', borderRadius: '16px', gap: '10%'}}>
                  <input  onChange = {(event) => onPostChange(post.id, 'title', event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '95%', height: '5vh', left: '0%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '21px', display: 'flex', fontWeight: 500, alignItems: 'flex-start', justifyContent: 'flex-start', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', paddingLeft: '1%', resize: 'none', outline: 'none'}} value = {post.title} placeholder = 'Temat wpisu' onFocus = {(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur = {(event) => (event.target.style.border = '')}></input>
                  <textarea onChange = {(event) => onPostChange(post.id, 'text', event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '95%', height: '20vh', left: '0%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '16px', display: 'flex', fontWeight: 500, alignItems: 'flex-start', justifyContent: 'flex-start', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', paddingLeft: '1%', paddingTop: '0.5%', resize: 'none', outline: 'none'}} value = {post.text} placeholder = 'Tresc wpisu' onFocus = {(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur = {(event) => (event.target.style.border = '')}></textarea>
                </div>
                  <div onClick = {() => onEditpostclick(post.id, post.editmode == 2 ? 1 : 0)} style = {{backgroundColor: 'rgb(26, 26, 42)', width: '5%', aspectRatio: '1 / 1', position: 'relative', left: '-2.5%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                    <img src = {accepticon} style = {{width: '25%', height: '25%'}}/>
                  </div>
                  <div onClick = {() => onCancelpostclick(post.id)} style = {{backgroundColor: 'rgb(26, 26, 42)', width: '5%', aspectRatio: '1 / 1', position: 'relative', left: '-1%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                    <img src = {cancelicon} style = {{width: '25%', height: '25%'}}/>
                  </div>
              </div>
            )
          ))}








        </div>



      </div>

  )
}




