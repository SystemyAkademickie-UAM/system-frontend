import { useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getApiBaseUrl, getSamlLoginUrl } from '../../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../api-test/mock/browserIdStorage.js';


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





  function onDeletepostclick(id) {
    const newposts = [];
    let i = 0;

    while (i < posts.length) {
      if (posts[i].id != id) {
        newposts.push(posts[i]);
      }
      i = i + 1;
    }
    setPosts(newposts);
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





  useEffect(() => {
    onFetchPosts();
  }, []);





  return (
    <div className="profile-content">
      <div className="profile-content__inner">






          <div style = {{width: '98%', height: '7.5%', position: 'absolute', top: '3%', left: '1%', color: 'rgb(227, 224, 247)', fontSize: '42px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}>Zarzadzanie Wpisami</div>
          <div style = {{width: '98%', height: '5%', position: 'absolute', top: '10.5%', left: '1%', color: 'rgb(187, 203, 185)', fontSize: '100%', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span>Edytor wpisow pozwalajacy tworzyc niesamowite historie budujace tlo fabularne grupy.</span></div>
        </div>



        <div style = {{width: '49%', height: '5%', top: '17.5%', left: '1%', position: 'absolute', color: 'rgb(227, 224, 247)', fontSize: '28px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span>Wpisy</span></div>
        {tempPosts.length == 0 && (<div onClick = {addpost} style = {{backgroundColor: 'rgba(66, 243, 125)', width: '15%', height: '5%', top: '17.5%', left: '84%', position: 'absolute', borderRadius: '8px', color: 'rgb(0, 57, 21)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer'}}>Dodaj wpis</div>)}





        <div style={{backgroundColor: 'rgb(26, 26, 42)', width: '98%', position: 'absolute', top: '25%', left: '1%', display: 'flex', flexDirection: 'column', gap: '2.5vh', borderRadius: '16px', paddingTop: '1%', paddingBottom: '1%'}}>



          {[...tempPosts, ...posts].map((post) => (

            post.editmode < 1 ? (


              <div key={'post' + post.id} style={{backgroundColor: 'rgb(26, 26, 42)', width: '98%', position: 'relative', left: '1%', display: 'flex', flexDirection: 'row', alignItems: 'center', borderRadius: '16px'}}>
                <div style = {{backgroundColor: 'rgb(40, 40, 52)', width: '87.5%', height: '25vh', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', fontWeight: 500, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                  <div onChange = {(event) => onGroupdescriptionchange(event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '100%', height: '5vh', left: '0%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '18px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', paddingLeft: '1%', resize: 'none'}} placeholder = 'Temat wpisu'>{post.title}</div>
                  <div onChange = {(event) => onGroupdescriptionchange(event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '100%', height: '20vh', left: '0%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'flex-start', justifyContent: 'flex-start', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', paddingLeft: '1%', resize: 'none'}} placeholder = 'Tresc wpisu'>{post.text}</div>
                </div>
                <div onClick={() => onEditpostclick(post.id, 0)} style={{backgroundColor: 'rgb(255, 0, 255)', width: '5%', aspectRatio: '1 / 1', position: 'relative', left: '1%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                  <img style={{width: '50%', height: '50%'}}/>
                </div>
                <div onClick = {() => onDeletepostclick(post.id)} style = {{backgroundColor: 'rgb(255, 0, 255)', width: '5%', aspectRatio: '1 / 1', position: 'relative', left: '2.5%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                  <img style = {{width: '50%', height: '50%'}}/>
                </div>
              </div>


            ) : (

              <div key={'post' + post.id} style={{backgroundColor: 'rgb(26, 26, 42)', width: '98%', position: 'relative', left: '1%', display: 'flex', flexDirection: 'row', alignItems: 'center', borderRadius: '16px'}}>
                <div style = {{backgroundColor: 'rgb(40, 40, 52)', width: '87.5%', height: '25vh', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', fontWeight: 500, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                  <input onChange={(event) => onPostChange(post.id, 'title', event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '100%', height: '5vh', left: '0%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '18px', display: 'flex', fontWeight: 500, alignItems: 'flex-start', justifyContent: 'flex-start', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', paddingLeft: '1%', resize: 'none'}} value = {post.title} placeholder = 'Temat wpisu'></input>
                  <textarea onChange={(event) => onPostChange(post.id, 'text', event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '100%', height: '20vh', left: '0%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'flex-start', justifyContent: 'flex-start', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', paddingLeft: '1%', paddingTop: '0.5%', resize: 'none'}} value = {post.text} placeholder = 'Tresc wpisu'></textarea>
                </div>
                  <div onClick={() => onEditpostclick(post.id, post.editmode == 2 ? 1 : 0)} style={{backgroundColor: 'rgb(255, 0, 255)', width: '5%', aspectRatio: '1 / 1', position: 'relative', left: '1%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                    <img style={{width: '50%', height: '50%'}}/>
                  </div>
                <div onClick = {() => onDeletepostclick(post.id)} style = {{backgroundColor: 'rgb(255, 0, 255)', width: '5%', aspectRatio: '1 / 1', position: 'relative', left: '2.5%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                  <img style = {{width: '50%', height: '50%'}}/>
                </div>
              </div>
            )
          ))}








        </div>



      </div>

  )
}




