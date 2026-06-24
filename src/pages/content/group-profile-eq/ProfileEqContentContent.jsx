import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {getApiBaseUrl} from '../../../constants/api.constants.js';
import {getOrCreateBrowserId} from '../api-test/mock/browserIdStorage.js';
import AssetSvg from '../../../components/ui/AssetSvg/AssetSvg.jsx';
import {resolveSvgAssetName} from '../../../utils/svgAssetPath.js';
import {
  GROUP_INVENTORY_INVALIDATED,
  subscribeGroupScopedEvent,
} from '../../../services/studentProfileEvents.js';

export default function App() {

  const {groupId} = useParams();
  const [errorMessage, setErrorMessage] = useState('');

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalpurchased, setTotalpurchased] = useState(0);
  const [uniquecount, setUniquecount] = useState(0);
  const [togglealllabel, setTogglealllabel] = useState('Odznacz wszystkie');



  async function onfetchinventory() {

    setErrorMessage('');

    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/groups/' + groupId + '/inventory';

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        }
      });

      const responsetext = await response.text();

      console.log('GET /groups/' + groupId + '/inventory: ', response.status);
      console.log('GET /groups/' + groupId + '/inventory: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/groups/' + groupId + '/inventory not JSON: ' + responsetext);
      }

      console.log('GET /groups/' + groupId + '/inventory JSON:', data);

      let receiveddata = data;

      if (!Array.isArray(receiveddata)) {
        receiveddata = [];
      }

      const receivedentries = [];
      const uniqueitemids = [];

      let i = 0;

      while (i < receiveddata.length) {

        let entryitem = receiveddata[i].item;

        let categoryid = entryitem.categoryId;

        if (categoryid == null) {
          categoryid = 0;
        }

        let imageref = entryitem.imageRef;

        let iconcolour = 'rgb(255,255,255)';
        let iconbackground = 'rgb(40,40,52)';
        let imageissvg = 0;

        if (imageref != null && imageref.indexOf('*') >= 0) {

          let imageparts = imageref.split('*');

          imageref = imageparts[0];

          if (imageparts.length > 1) {
            iconcolour = imageparts[1];
          }

          if (imageparts.length > 2) {
            iconbackground = imageparts[2];
          }

        }

        if (imageref != null && imageref.trim().endsWith('.svg')) {
          imageissvg = 1;
          imageref = 'backend:' + imageref.trim();
        }



        let storydescription = entryitem.storyDescription;

        if (storydescription == null) {
          storydescription = '';
        }

        let educationaldescription = entryitem.educationalDescription;

        if (educationaldescription == null) {
          educationaldescription = '';
        }

        let entryname = entryitem.name;

        if (entryname == null) {
          entryname = '';
        }

        let quantity = receiveddata[i].quantity;

        if (quantity == null) {
          quantity = 0;
        }

        let itemid = receiveddata[i].itemId;

        if (itemid == null) {
          itemid = entryitem.id;
        }

        let entryid = receiveddata[i].id;

        if (entryid == null) {
          entryid = 0;
        }

        let itemused = 0;

        if (receiveddata[i].used == 1 || receiveddata[i].used == true || receiveddata[i].isUsed == 1 || receiveddata[i].isUsed == true) {
          itemused = 1;
        }

        let j = 0;

        while (j < quantity) {

          receivedentries.push({
            uniquekey: entryid + '_' + itemid + '_' + j,
            entryid: entryid,
            itemid: itemid,
            name: entryname,
            storydescription: storydescription,
            educationaldescription: educationaldescription,
            imageissvg: imageissvg,
            imageref: imageref,
            iconcolour: iconcolour,
            iconbackground: iconbackground,
            categoryid: categoryid,
            purchaseprice: 99,
            itemused: itemused
          });

          j = j + 1;
        }

        let alreadyunique = 0;

        let k = 0;

        while (k < uniqueitemids.length) {

          if (uniqueitemids[k] == itemid) {
            alreadyunique = 1;
          }

          k = k + 1;
        }

        if (alreadyunique == 0 && quantity > 0) {
          uniqueitemids.push(itemid);
        }

        i = i + 1;
      }

      setItems(receivedentries);
      setTotalpurchased(receivedentries.length);
      setUniquecount(uniqueitemids.length);

      onfetchcategories(receivedentries);

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





  async function onfetchcategories(receivedentries) {

    setErrorMessage('');

    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/groups/' + groupId + '/item-categories';

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        }
      });

      const responsetext = await response.text();

      console.log('GET /groups/' + groupId + '/item-categories: ', response.status);
      console.log('GET /groups/' + groupId + '/item-categories: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/groups/' + groupId + '/item-categories not JSON: ' + responsetext);
      }

      console.log('GET /groups/' + groupId + '/item-categories JSON:', data);

      let receivedcategories = data;

      if (!Array.isArray(receivedcategories)) {
        receivedcategories = [];
      }

      const usedcategoryids = [];

      let i = 0;

      while (i < receivedentries.length) {

        let alreadyused = 0;

        let j = 0;

        while (j < usedcategoryids.length) {

          if (usedcategoryids[j] == receivedentries[i].categoryid) {
            alreadyused = 1;
          }

          j = j + 1;
        }

        if (alreadyused == 0) {
          usedcategoryids.push(receivedentries[i].categoryid);
        }

        i = i + 1;
      }

      const filtercategories = [];

      i = 0;

      while (i < usedcategoryids.length) {

        if (usedcategoryids[i] == 0) {

          filtercategories.push({id: 0, name: '- - -', checked: 1});

        } else {

          let categoryname = 'Kategoria ' + usedcategoryids[i];

          let j = 0;

          while (j < receivedcategories.length) {

            if (receivedcategories[j].id == usedcategoryids[i]) {

              if (receivedcategories[j].name != null) {
                categoryname = receivedcategories[j].name;
              }

            }

            j = j + 1;
          }

          filtercategories.push({id: usedcategoryids[i], name: categoryname, checked: 1});

        }

        i = i + 1;
      }

      setCategories(filtercategories);
      setTogglealllabel('Odznacz wszystkie');

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





  function oncategorychange(categoryId) {

    const newcategories = [];

    let i = 0;

    while (i < categories.length) {

      if (categories[i].id == categoryId) {

        let newchecked = 1;

        if (categories[i].checked == 1) {
          newchecked = 0;
        }

        newcategories.push({id: categories[i].id, name: categories[i].name, checked: newchecked});

      } else {
        newcategories.push(categories[i]);
      }

      i = i + 1;
    }

    setCategories(newcategories);

    updatetogglealllabel(newcategories);
  }





  function updatetogglealllabel(categorylist) {

    let allchecked = 1;

    let i = 0;

    while (i < categorylist.length) {

      if (categorylist[i].checked == 0) {
        allchecked = 0;
      }

      i = i + 1;
    }

    if (allchecked == 1) {
      setTogglealllabel('Odznacz wszystkie');
    } else {
      setTogglealllabel('Zaznacz wszystkie');
    }
  }





  function ontoggleallcategories() {

    let allchecked = 1;

    let i = 0;

    while (i < categories.length) {

      if (categories[i].checked == 0) {
        allchecked = 0;
      }

      i = i + 1;
    }

    const newcategories = [];

    i = 0;

    while (i < categories.length) {

      let newchecked = 1;

      if (allchecked == 1) {
        newchecked = 0;
      }

      newcategories.push({id: categories[i].id, name: categories[i].name, checked: newchecked});

      i = i + 1;
    }

    setCategories(newcategories);

    updatetogglealllabel(newcategories);
  }





  function isitemvisible(item) {

    let i = 0;

    while (i < categories.length) {

      if (categories[i].id == item.categoryid) {

        if (categories[i].checked == 1) {
          return 1;
        } else {
          return 0;
        }

      }

      i = i + 1;
    }

    return 1;
  }





  function getcategorynameforitem(item) {

    let i = 0;

    while (i < categories.length) {

      if (categories[i].id == item.categoryid) {
        return categories[i].name;
      }

      i = i + 1;
    }

    return '';
  }





  async function onitemuse(itemId) {

    setErrorMessage('');

    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/groups/' + groupId + '/inventory/' + itemId + '/use';

      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        },
        body: JSON.stringify({})
      });

      const responsetext = await response.text();

      console.log('POST /groups/' + groupId + '/inventory/' + itemId + '/use: ', response.status);
      console.log('POST /groups/' + groupId + '/inventory/' + itemId + '/use: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/groups/' + groupId + '/inventory/' + itemId + '/use not JSON: ' + responsetext);
      }

      console.log('POST /groups/' + groupId + '/inventory/' + itemId + '/use JSON:', data);

      onfetchinventory();

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





  useEffect(() => {
    onfetchinventory();
  }, []);

  useEffect(() => {
    if (!groupId) {
      return undefined;
    }

    return subscribeGroupScopedEvent(GROUP_INVENTORY_INVALIDATED, (eventGroupId) => {
      if (eventGroupId === String(groupId)) {
        onfetchinventory();
      }
    });
  }, [groupId]);





  return (
    <div>
      <div>
        <div style = {{width: '100%', height: '100%', position: 'relative', top: '0%', left: '0%', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          <div style = {{width: '100%', position: 'relative', top: '0%', left: '0%', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '1rem'}}>
            <div style = {{color: 'rgb(227, 224, 247)', fontSize: '1.75rem', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}>Ekwipunek</div>
          </div>

          <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5%', flexWrap: 'wrap'}}>
            <div style = {{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1%'}}>
              <div style = {{width: '100%', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}>Zakupione przedmioty:</div>
              <div style = {{width: '5vw', height: '5vh', borderRadius: '16px', backgroundColor: 'rgba(30, 204, 56, 0.1)', border: '2px solid rgba(30, 204, 56, 0.2)', color: 'rgb(227, 224, 247)', fontSize: '21px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center'}}>{totalpurchased}</div>
            </div>
            <div style = {{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1%'}}>
              <div style = {{width: '100%', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}>Unikatowe przedmioty:</div>
              <div style = {{width: '5vw', height: '5vh', borderRadius: '16px', backgroundColor: 'rgba(30, 204, 56, 0.1)', border: '2px solid rgba(30, 204, 56, 0.2)', color: 'rgb(227, 224, 247)', fontSize: '21px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center'}}>{uniquecount}</div>
            </div>
          </div>



          {categories.length > 0 ? (
            <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '2.5vh', paddingTop: '0.5vh', paddingBottom: '0.5vh'}}>
              <div style = {{color: 'rgb(227, 224, 247)', fontSize: '21px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingTop: '1vh'}}>Kategorie</div>
              <div onClick = {() => ontoggleallcategories()} style = {{backgroundColor: 'rgba(30, 204, 56)', width: 'fit-content', position: 'relative', borderRadius: '8px', color: 'rgb(0, 57, 21)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingLeft: '1.5vw', paddingRight: '1.5vw', paddingTop: '0.5vh', paddingBottom: '0.5vh', cursor: 'pointer'}}>{togglealllabel}</div>
              <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '2vw'}}>
                {categories.map((category) => (
                  <div key = {'filter' + category.id} style = {{backgroundColor: category.checked == 1 ? 'rgba(26, 26, 42, 0.5)' : 'rgba(26, 26, 42, 0.5)', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: '0.5vh', paddingBottom: '0.5vh', paddingLeft: '1%', paddingRight: '1%', borderRadius: '16px'}}>

                    <input type = "checkbox" checked = {category.checked == 1} onChange = {() => oncategorychange(category.id)} style = {{cursor: 'pointer'}}/>
                    <div style = {{color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 500, paddingLeft: '0.5vw', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{category.name}</div>
                  </div>
                ))}
              </div>
              
            </div>
          ) : null}

          {items.length == 0 ? (
            <div style = {{color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}>Brak zakupionych przedmiotów.</div>
          ) : (
            <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '2vh', paddingTop: '0.5vh', paddingBottom: '1vh'}}>
              {items.map((item) => (
                isitemvisible(item) == 1 ? (
                  <div key = {item.uniquekey} style = {{flex: '0 calc(94% / 5)', display: 'flex', flexDirection: 'column', borderRadius: '16px', backgroundColor: 'rgb(26, 26, 42)', overflow: 'hidden', opacity: item.itemused == 1 ? 0.5 : 1}}>
                    <div style = {{position: 'relative', aspectRatio: '2 / 1', width: '100%', overflow: 'hidden'}}>
                      {item.imageissvg == 1 ? (
                        <div style = {{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: item.iconbackground, color: item.iconcolour}}>
                          <AssetSvg name = {resolveSvgAssetName(item.imageref)} width = {48} height = {48}/>
                        </div>
                      ) : (
                        <div style = {{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5%', width: '100%', height: '100%', backgroundColor: 'rgb(26, 26, 42)'}}></div>
                      )}
                      {getcategorynameforitem(item) != '' ? (
                        <div style = {{position: 'absolute', top: '1vh', left: '0.5vw', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5%'}}>
                          <div style = {{display: 'flex', paddingTop: '0.5vh', paddingBottom: '0.25vh', paddingLeft: '0.5vw', paddingRight: '0.5vw', borderRadius: '16px', backgroundColor: 'rgba(30, 204, 56, 0.2)', color: 'rgb(30, 204, 56)', fontSize: '14px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{getcategorynameforitem(item)}</div>
                        </div>
                      ) : null}
                    </div>
                    <div style = {{display: 'flex', flexDirection: 'column', gap: '0.5vh', paddingTop: '0.75vh', paddingLeft: '1vw', paddingRight: '1vw', paddingBottom: '0.75vh'}}>
                      <div style = {{fontSize: '18px', fontWeight: 700, color: 'rgb(227, 224, 247)', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1, overflow: 'hidden'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{item.name}</span></div>
                      <div style = {{fontSize: '14px', fontStyle: 'italic', fontWeight: 500, color: 'rgb(187, 203, 185)', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3, overflow: 'hidden', marginBottom: '1vh'}}>{item.storydescription != '' ? item.storydescription : ' '}</div>
                      <div style = {{display: 'flex', flexDirection: 'column', gap: '0.25vh', paddingTop: '0.5vh', paddingBottom: '0.5vh', paddingLeft: '0.5vw', paddingRight: '0.5vw', borderRadius: '14px', backgroundColor: 'rgb(40, 40, 56)'}}>
                        <div style = {{fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', color: 'rgb(30, 204, 56)'}}>Opis dydaktyczny</div>
                        <div style = {{fontSize: '14px', fontWeight: 500, color: 'rgb(227, 224, 247)', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3, overflow: 'hidden'}}>{item.educationaldescription != '' ? item.educationaldescription : ' '}</div>
                      </div>
                    </div>
                    <div style = {{marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '0.75vh', paddingTop: '1vh', paddingLeft: '1vh', paddingRight: '1vw', paddingBottom: '1vw', borderTop: '1px solid rgba(255, 255, 255, 0.1)'}}>
                      <div style = {{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '0.25vw', color: 'rgb(30, 204, 56)'}}>
                        <div style = {{fontSize: '16px', fontWeight: 700}}>{item.purchaseprice}*</div>
                        <div onClick = {() => onitemuse(item.itemid)} style = {{fontSize: '14px', fontWeight: 700, color: 'rgb(30, 204, 56)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Użyj</div>
                      </div>
                    </div>
                  </div>
                ) : null
              ))}
            </div>
          )}

        </div>


      </div>
    </div>
  )
}



