import {useState, useEffect, useRef} from 'react';
import {useParams} from 'react-router-dom';
import {getApiBaseUrl} from '../../../constants/api.constants.js';
import {getOrCreateBrowserId} from '../api-test/mock/browserIdStorage.js';
import {InfoTooltip, useToast} from '../../../components/ui/index.js';
import AssetSvg from '../../../components/ui/AssetSvg/AssetSvg.jsx';
import {resolveSvgAssetName} from '../../../utils/svgAssetPath.js';

import arrowcirclelefticon from '../../../../public/assets/icons/arrow-circle-left-svgrepo-com.svg';
import arrowcirclerighticon from '../../../../public/assets/icons/arrow-circle-right-svgrepo-com.svg';
import skipbackicon from '../../../../public/assets/icons/skip-back-svgrepo-com.svg';
import skipforwardicon from '../../../../public/assets/icons/skip-forward-svgrepo-com.svg';
import chevronlefticon from '../../../../public/assets/icons/chevron-left-svgrepo-com.svg';
import chevronrighticon from '../../../../public/assets/icons/chevron-right-svgrepo-com.svg';
import editicon from '../../../../public/assets/icons/edit-02-svgrepo-com.svg';
import deleteicon from '../../../../public/assets/icons/trash-01-svgrepo-com.svg';
import checkicon from '../../../../public/assets/icons/check-svgrepo-com.svg';
import closeicon from '../../../../public/assets/icons/x-close-svgrepo-com.svg';
import leftleft from '../../../../public/assets/icons/chevron-left-double-svgrepo-com.svg';
import left from '../../../../public/assets/icons/chevron-left-svgrepo-com.svg';
import rightright from '../../../../public/assets/icons/chevron-right-double-svgrepo-com.svg';
import right from '../../../../public/assets/icons/chevron-right-svgrepo-com.svg';
import up from '../../../../public/assets/icons/chevron-up-svgrepo-com.svg';
import down from '../../../../public/assets/icons/chevron-down-svgrepo-com.svg';

import 'unicode-emoji-picker';

export default function App() {

  const {showSuccess, showError} = useToast();

  const {groupId} = useParams();
  const [errorMessage, setErrorMessage] = useState('');

  const [currenticon, setCurrenticon] = useState('🍑');
  const [iconbackground, setIconbackground] = useState('rgb(40,40,52)');
  
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef(null);

  const [itemname, setItemname] = useState('');
  const [description0, setDescription0] = useState('');
  const [description1, setDescription1] = useState('');
  const [cost, setCost] = useState('');
  const [minprice, setMinprice] = useState('');
  const [minpriceenabled, setMinpriceenabled] = useState(0);
  const [grouplimit, setGrouplimit] = useState('');
  const [grouplimitenabled, setGrouplimitenabled] = useState(0);
  const [studentlimit, setStudentlimit] = useState('');
  const [studentlimitenabled, setStudentlimitenabled] = useState(0);

  const [categories, setCategories] = useState([]);
  const [categoriesopen, setCategoriesopen] = useState(0);
  const [addingcategory, setAddingcategory] = useState(0);
  const [newcategoryname, setNewcategoryname] = useState('');

  const [ranks, setRanks] = useState([]);
  const [ranksfrombackend, setRanksfrombackend] = useState(0);

  const [badges, setBadges] = useState([]);
  const [badgediscounts, setBadgediscounts] = useState([]);
  const [selectedbadge, setSelectedbadge] = useState('Wybierz odznakę');
  const [pendingdiscountvalue, setPendingdiscountvalue] = useState('');



  function onPickerMounted(picker) {

    if (!picker) {
      return;
    }

    picker.addEventListener('emoji-pick', (event) => {
      setCurrenticon(event.detail.emoji);
      setIsPickerOpen(false);
    });
  }





  function rgbstringtohex(rgbvalue) {

    let cleaned = rgbvalue.replace('rgb(', '').replace(')', '').replace(' ', '');
    let parts = cleaned.split(',');

    let red = Number(parts[0]);
    let green = Number(parts[1]);
    let blue = Number(parts[2]);

    let redhex = red.toString(16);
    let greenhex = green.toString(16);
    let bluehex = blue.toString(16);

    if (redhex.length == 1) {
      redhex = '0' + redhex;
    }

    if (greenhex.length == 1) {
      greenhex = '0' + greenhex;
    }

    if (bluehex.length == 1) {
      bluehex = '0' + bluehex;
    }

    return '#' + redhex + greenhex + bluehex;
  }



  function hextorgbstring(hexvalue) {

    let cleanhex = hexvalue.replace('#', '');

    let red = parseInt(cleanhex.substring(0, 2), 16);
    let green = parseInt(cleanhex.substring(2, 4), 16);
    let blue = parseInt(cleanhex.substring(4, 6), 16);

    return 'rgb(' + red + ',' + green + ',' + blue + ')';
  }



  function getcategoryinputwidth(tempname) {

    let widthvalue = 10 + tempname.length * 1.5;

    if (widthvalue < 10) {
      widthvalue = 10;
    }

    if (widthvalue > 90) {
      widthvalue = 90;
    }

    return widthvalue + '%';
  }



  function onNumericinput(stringvalue, setterfunction) {

    let filtered = '';

    let i = 0;

    while (i < stringvalue.length) {

      let character = stringvalue[i];

      if (character == '0' || character == '1' || character == '2' || character == '3' || character == '4' || character == '5' || character == '6' || character == '7' || character == '8' || character == '9') {
        filtered = filtered + character;
      }

      i = i + 1;
    }

    setterfunction(filtered);
  }





  function onDiscountinput(stringvalue, setterfunction) {

    let filtered = '';

    let i = 0;

    while (i < stringvalue.length) {

      let character = stringvalue[i];

      if (character == '0' || character == '1' || character == '2' || character == '3' || character == '4' || character == '5' || character == '6' || character == '7' || character == '8' || character == '9' || character == '%') {
        filtered = filtered + character;
      }

      i = i + 1;
    }

    setterfunction(filtered);
  }












  async function onFetchcategories() {

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

      let receiveddata = data;

      if (!Array.isArray(receiveddata)) {
        receiveddata = [];
      }

      const receivedcategories = [];

      let i = 0;

      while (i < receiveddata.length) {

        receivedcategories.push({id: receiveddata[i].id, name: receiveddata[i].name, checked: 0, editmode: 0, tempname: receiveddata[i].name});

        i = i + 1;
      }

      setCategories(receivedcategories);

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






  async function createcategory(name) {

    setErrorMessage('');

    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/groups/' + groupId + '/item-categories';

      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        },
        body: JSON.stringify({
          name: name
        })
      });

      const responsetext = await response.text();

      console.log('POST /groups/' + groupId + '/item-categories: ', response.status);
      console.log('POST /groups/' + groupId + '/item-categories: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/groups/' + groupId + '/item-categories not JSON: ' + responsetext);
      }

      console.log('POST /groups/' + groupId + '/item-categories JSON:', data);

      onFetchcategories();
      setAddingcategory(0);
      setNewcategoryname('');
      showSuccess('Kategoria została utworzona.');

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


  async function updatecategory(categoryId, name) {

    setErrorMessage('');

    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/groups/' + groupId + '/item-categories/' + categoryId;

      const response = await fetch(url, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        },
        body: JSON.stringify({
          name: name
        })
      });

      const responsetext = await response.text();

      console.log('PATCH /groups/' + groupId + '/item-categories/' + categoryId + ': ', response.status);
      console.log('PATCH /groups/' + groupId + '/item-categories/' + categoryId + ': ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/groups/' + groupId + '/item-categories/' + categoryId + ' not JSON: ' + responsetext);
      }

      console.log('PATCH /groups/' + groupId + '/item-categories/' + categoryId + ' JSON:', data);

      onFetchcategories();

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





  async function deletecategory(categoryId) {

    setErrorMessage('');

    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/groups/' + groupId + '/item-categories/' + categoryId;

      const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        }
      });

      const responsetext = await response.text();

      console.log('DELETE /groups/' + groupId + '/item-categories/' + categoryId + ': ', response.status);
      console.log('DELETE /groups/' + groupId + '/item-categories/' + categoryId + ': ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/groups/' + groupId + '/item-categories/' + categoryId + ' not JSON: ' + responsetext);
      }

      console.log('DELETE /groups/' + groupId + '/item-categories/' + categoryId + ' JSON:', data);

      onFetchcategories();
      showSuccess('Kategoria została usunięta.');

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





  async function onfetchranks() {

    setErrorMessage('');

    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/groups/' + groupId + '/ranks';

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        }
      });

      const responsetext = await response.text();

      console.log('GET /groups/' + groupId + '/ranks: ', response.status);
      console.log('GET /groups/' + groupId + '/ranks: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/groups/' + groupId + '/ranks not JSON: ' + responsetext);
      }

      console.log('GET /groups/' + groupId + '/ranks JSON:', data);

      let receiveddata = data;

      if (!Array.isArray(receiveddata)) {
        receiveddata = [];
      }

      const receivedranks = [];

      let i = 0;

      while (i < receiveddata.length) {

        let discountvalue = receiveddata[i].discount;

        if (discountvalue == null) {
          discountvalue = 0;
        }

        let iconvalue = receiveddata[i].icon;

        if (iconvalue == null) {
          iconvalue = '';
        }

        receivedranks.push({id: receiveddata[i].id, icon: iconvalue ? `backend:${iconvalue}` : '', name: receiveddata[i].name, discount: discountvalue, costafter: '', isCustom: 0});

        i = i + 1;
      }

      setRanks(receivedranks);
      setRanksfrombackend(1);

      if (cost != '') {
        recalculatediscounts(cost);
      }

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





  async function onfetchbadges() {

    setErrorMessage('');

    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/groups/' + groupId + '/badges';

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        }
      });

      const responsetext = await response.text();

      console.log('GET /groups/' + groupId + '/badges: ', response.status);
      console.log('GET /groups/' + groupId + '/badges: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/groups/' + groupId + '/badges not JSON: ' + responsetext);
      }

      console.log('GET /groups/' + groupId + '/badges JSON:', data);

      let receiveddata = data;

      if (!Array.isArray(receiveddata)) {
        receiveddata = [];
      }

      const receivedbadges = [];

      let i = 0;

      while (i < receiveddata.length) {

        receivedbadges.push({id: receiveddata[i].id, name: receiveddata[i].name});

        i = i + 1;
      }

      setBadges(receivedbadges);

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





  function starteditcategory(categoryId) {

    const newcategories = [];

    let i = 0;

    while (i < categories.length) {

      if (categories[i].id == categoryId) {

        newcategories.push({id: categories[i].id, name: categories[i].name, checked: categories[i].checked, editmode: 1, tempname: categories[i].name});

      } else {
        newcategories.push(categories[i]);
      }

      i = i + 1;
    }

    setCategories(newcategories);
  }





  function saveeditcategory(categoryId) {

    let categorynamevalue = null;

    const newcategories = [];

    let i = 0;

    while (i < categories.length) {

      if (categories[i].id == categoryId) {

        newcategories.push({id: categories[i].id, name: categories[i].tempname, checked: categories[i].checked, editmode: 0, tempname: categories[i].tempname});
        categorynamevalue = categories[i].tempname;

      } else {
        newcategories.push(categories[i]);
      }

      i = i + 1;
    }

    setCategories(newcategories);

    if (categorynamevalue != null) {
      updatecategory(categoryId, categorynamevalue);
    }
  }





  function canceleditcategory(categoryId) {

    const newcategories = [];

    let i = 0;

    while (i < categories.length) {

      if (categories[i].id == categoryId) {

        newcategories.push({id: categories[i].id, name: categories[i].name, checked: categories[i].checked, editmode: 0, tempname: categories[i].name});

      } else {
        newcategories.push(categories[i]);
      }

      i = i + 1;
    }

    setCategories(newcategories);
  }





  function oncategorynamechange(categoryId, value) {

    const newcategories = [];

    let i = 0;

    while (i < categories.length) {

      if (categories[i].id == categoryId) {

        let updatedcategory = {id: categories[i].id, name: categories[i].name, checked: categories[i].checked, editmode: categories[i].editmode, tempname: value};

        newcategories.push(updatedcategory);

      } else {
        newcategories.push(categories[i]);
      }

      i = i + 1;
    }

    setCategories(newcategories);
  }





  function oncategorycheckchange(categoryId) {

    const newcategories = [];

    let i = 0;

    while (i < categories.length) {

      if (categories[i].id == categoryId) {

        let newchecked = 1;

        if (categories[i].checked == 1) {
          newchecked = 0;
        }

        newcategories.push({id: categories[i].id, name: categories[i].name, checked: newchecked, editmode: categories[i].editmode, tempname: categories[i].tempname});

      } else {
        newcategories.push(categories[i]);
      }

      i = i + 1;
    }

    setCategories(newcategories);
  }





  function togglecategoriesopen() {

    if (categoriesopen == 0) {
      setCategoriesopen(1);
    } else {
      setCategoriesopen(0);
    }
  }





  function confirmaddcategory() {

    if (newcategoryname.trim().length == 0) {
      showError('Prosze wpisac nazwe kategorii.');
      return;
    }

    createcategory(newcategoryname.trim());
  }





  function canceladdcategory() {
    setAddingcategory(0);
    setNewcategoryname('');
  }





  function recalculatediscounts(basecostvalue) {

    const basecost = Number(basecostvalue);

    const newranks = [];

    let i = 0;

    while (i < ranks.length) {

      let newcostafter = '';

      if (basecostvalue != '' && basecost > 0) {

        let discounted = basecost - Math.round(basecost * ranks[i].discount / 100);

        if (discounted < 0) {
          discounted = 0;
        }

        newcostafter = discounted;
      }

      newranks.push({id: ranks[i].id, icon: ranks[i].icon, name: ranks[i].name, discount: ranks[i].discount, costafter: newcostafter, isCustom: 0});

      i = i + 1;
    }

    setRanks(newranks);
  }





  function onrankcostchange(rankId, value) {

    const newranks = [];

    let i = 0;

    while (i < ranks.length) {

      if (ranks[i].id == rankId) {
        newranks.push({id: ranks[i].id, icon: ranks[i].icon, name: ranks[i].name, discount: ranks[i].discount, costafter: value, isCustom: 1});
      } else {
        newranks.push(ranks[i]);
      }

      i = i + 1;
    }

    setRanks(newranks);
  }





  function onbadgediscountchange(discountId, value) {

    const newdiscounts = [];

    let i = 0;

    while (i < badgediscounts.length) {

      if (badgediscounts[i].id == discountId) {
        newdiscounts.push({id: badgediscounts[i].id, badgeid: badgediscounts[i].badgeid, badgename: badgediscounts[i].badgename, value: value});
      } else {
        newdiscounts.push(badgediscounts[i]);
      }

      i = i + 1;
    }

    setBadgediscounts(newdiscounts);
  }





  function addbadgediscount() {

    if (selectedbadge == 'Wybierz odznakę') {
      showError('Prosze wybrac odznake.');
      return;
    }

    let alreadyused = 0;

    let i = 0;

    while (i < badgediscounts.length) {

      if (badgediscounts[i].badgename == selectedbadge) {
        alreadyused = 1;
      }

      i = i + 1;
    }

    if (alreadyused == 1) {
      showError('Znizka zwiazana z ta odznaka juz istnieje.');
      return;
    }

    if (pendingdiscountvalue.length == 0) {
      showError('Prosze wpisac wartosc znizki.');
      return;
    }

    let badgeid = 0;

    i = 0;

    while (i < badges.length) {

      if (badges[i].name == selectedbadge) {
        badgeid = badges[i].id;
      }

      i = i + 1;
    }

    const newdiscounts = [];

    i = 0;

    while (i < badgediscounts.length) {
      newdiscounts.push(badgediscounts[i]);
      i = i + 1;
    }

    newdiscounts.push({id: badgediscounts.length, badgeid: badgeid, badgename: selectedbadge, value: pendingdiscountvalue});

    setBadgediscounts(newdiscounts);
    setSelectedbadge('Wybierz odznakę');
    setPendingdiscountvalue('');
    showSuccess('Zniżka dla odznaki została utworzona.');
  }





  function deletebadgediscount(discountId) {

    const newdiscounts = [];

    let i = 0;

    while (i < badgediscounts.length) {

      if (badgediscounts[i].id != discountId) {
        newdiscounts.push(badgediscounts[i]);
      }

      i = i + 1;
    }

    setBadgediscounts(newdiscounts);
    showSuccess('Zniżka za odznakę została usunięta.');
  }



  function goback() {
    window.location.href = '/groups/' + groupId + '/shop';
    showSuccess('Anulowano tworzenie przedmiotu.');
  }



  async function createitem() {

    if (itemname.trim().length == 0) {
      showError('Proszę wpisać nazwę przedmiotu.');
      return;
    }

    if (cost == '' || Number(cost) < 0) {
      showError('Proszę wpisać poprawny koszt przedmiotu.');
      return;
    }

    if (grouplimitenabled == 1 && grouplimit == '') {
      showError('Proszę wpisać limit sztuk na grupę lub odznaczyć limit.');
      return;
    }

    if (studentlimitenabled == 1 && studentlimit == '') {
      showError('Proszę wpisać limit sztuk na studenta lub odznaczyć limit.');
      return;
    }

    setErrorMessage('');

    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/groups/' + groupId + '/shop-items';

      const items = {
        name: itemname.trim(),
        basePrice: Number(cost),
        imageRef: currenticon + '*' + iconbackground
      };

      if (description0.trim().length > 0) {
        items.storyDescription = description0.trim();
      }

      if (description1.trim().length > 0) {
        items.educationalDescription = description1.trim();
      }

      let categoryid = null;

      let i = 0;

      while (i < categories.length) {

        if (categories[i].checked == 1 && categoryid == null) {
          categoryid = categories[i].id;
        }

        i = i + 1;
      }

      if (categoryid != null) {
        items.categoryId = categoryid;
      }

      if (grouplimitenabled == 1) {
        items.stockQuantity = Number(grouplimit);
      }

      if (studentlimitenabled == 1) {
        items.perStudentLimit = Number(studentlimit);
      }

      const badgePromotions = [];

      i = 0;

      while (i < badgediscounts.length) {

        let promotionType = 'fixed';
        let promotionValue = Number(badgediscounts[i].value);

        if (badgediscounts[i].value.endsWith('%')) {
          promotionType = 'percent';
          promotionValue = Number(badgediscounts[i].value.replace('%', ''));
        }

        badgePromotions.push({id: badgediscounts[i].badgeid, promotionType: promotionType, value: promotionValue});

        i = i + 1;
      }

      const rankPromotions = [];

      i = 0;

      while (i < ranks.length) {

        if (ranks[i].isCustom == 1 && ranks[i].costafter != '') {

          let discountValue = Number(cost) - Number(ranks[i].costafter);

          if (discountValue < 0) {
            discountValue = 0;
          }

          rankPromotions.push({id: ranks[i].id, promotionType: 'fixed', value: discountValue});
        }

        i = i + 1;
      }

      items.badgePromotions = badgePromotions;
      items.rankPromotions = rankPromotions;

      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        },
        body: JSON.stringify(items)
      });

      const responsetext = await response.text();

      console.log('POST /groups/' + groupId + '/shop-items: ', response.status);
      console.log('POST /groups/' + groupId + '/shop-items: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/groups/' + groupId + '/shop-items not JSON: ' + responsetext);
      }

      console.log('POST /groups/' + groupId + '/shop-items JSON:', data);

      if (!response.ok) {
        showError('Nie udalo sie utworzyc przedmiotu.');
        return;
      }

      showSuccess('Przedmiot został utworzony!');
      window.location.href = '/groups/' + groupId + '/shop';

    } catch (error) {

      let message;

      if (error instanceof Error) {
        message = error.message;
      } else {
        message = String(error);
      }

      setErrorMessage(message);
      showError(message);
    }
  }





  useEffect(() => {

    onFetchcategories();
    onfetchranks();
    onfetchbadges();

  }, []);



  return (
    <div>
      <div>

        <div style = {{width: '82vw', height: '100%', position: 'relative', top: '0%', left: '0%'}}>

          <div style = {{width: '98%', position: 'relative', top: '0%', left: '1%', display: 'flex', flexDirection: 'row', gap: '1%', paddingBottom: '4vh'}}>

            <div style = {{width: '66%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '2vh'}}>

              <div style = {{backgroundColor: 'rgb(26, 26, 42)', width: '100%', position: 'relative', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1.5vh', paddingTop: '2vh', paddingBottom: '2vh', paddingLeft: '2%', paddingRight: '2%'}}>

                <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '1vh', alignItems: 'center', paddingBottom: '1vh'}}>
                  <div style = {{width: '100%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}>Ikona przedmiotu</div>
                  <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '2vh'}}>
                    <div onClick = {() => setIsPickerOpen(!isPickerOpen)} style = {{backgroundColor: 'rgb(40, 40, 52)', height: '14vh', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                      <div style = {{color: 'rgb(227, 224, 247)', fontSize: '48px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'center'}}>{currenticon}</div>
                    </div>
                    {isPickerOpen ? (
                      <div onClick = {() => setIsPickerOpen(false)} style = {{position: 'fixed', top: '0vh', left: '0vw', width: '100vw',  height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999}}>
                        <div onClick = {(event) => event.stopPropagation()} style = {{position: 'relative'}}><unicode-emoji-picker ref = {onPickerMounted} style = {{'--fill-color': 'rgb(40, 40, 52)', '--text-color': 'rgb(227, 224, 247)', '--title-bar-fill-color': 'rgb(40, 40, 52)', '--variations-fill-color': 'rgb(26, 26, 42)', '--variations-backdrop-fill-color': 'rgba(40, 40, 52, 0.75)'}}></unicode-emoji-picker></div>
                      </div>
                    ) : null}
                  </div>
                  <div style = {{position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5vh'}}>
                    <div style = {{color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'center'}}>Kolor tła</div>
                    <div style = {{position: 'relative', width: '6vh', height: '6vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <div style = {{width: '100%', height: '100%', backgroundColor: iconbackground, borderRadius: '8px', border: '2px solid rgb(66, 243, 125)', cursor: 'pointer'}}></div>
                      <input type = "color" onChange = {(event) => setIconbackground(hextorgbstring(event.target.value))} value = {rgbstringtohex(iconbackground)} style = {{position: 'absolute', top: '0%', left: '0%', width: '100%', height: '100%', opacity: 0, cursor: 'pointer'}}/>
                    </div>
                  </div>
                </div>




                <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', gap: '2%'}}>
                
                  <div style = {{width: '66%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5vh'}}>

                    <div style = {{width: '100%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', gap: '0.5vw'}}>Nazwa przedmiotu</div>

                    <input onChange = {(event) => setItemname(event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', border: '2px solid rgba(0, 0, 0, 0)', width: '100%', height: '5vh', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', borderRadius: '8px', border: 'none', outline: 'none'}} value = {itemname} onFocus = {(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur = {(event) => (event.target.style.borderColor = 'rgba(0, 0, 0, 0)')}></input>
                  </div>
                  <div style = {{width: '32%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5vh'}}>
                    <div style = {{width: '100%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}>Cena</div>
                    <input onInput = {(event) => {onNumericinput(event.target.value, setCost); recalculatediscounts(event.target.value);}} style = {{backgroundColor: 'rgb(40, 40, 52)', border: '2px solid rgba(0, 0, 0, 0)', width: '100%', height: '5vh', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', borderRadius: '8px', border: 'none', outline: 'none', paddingRight: '1%', textAlign: 'left'}} value = {cost} onFocus = {(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur = {(event) => (event.target.style.borderColor = 'rgba(0, 0, 0, 0)')}></input>
                  </div>
                </div>

                <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5vh'}}>
                  <div style = {{width: '100%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}>Opis fabularny</div>
                  <textarea onChange = {(event) => setDescription0(event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', border: '2px solid rgba(0, 0, 0, 0)', width: '100%', height: '10vh', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'flex-start', justifyContent: 'flex-start', paddingLeft: '1%', paddingRight: '1%', paddingTop: '1vh', borderRadius: '8px', border: 'none', outline: 'none', resize: 'none', overflow: 'auto'}} value = {description0} onFocus = {(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur = {(event) => (event.target.style.borderColor = 'rgba(0, 0, 0, 0)')}></textarea>
                </div>

                <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5vh'}}>
                  <div style = {{width: '100%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}>Opis dydaktyczny</div>
                  <textarea onChange = {(event) => setDescription1(event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', border: '2px solid rgba(0, 0, 0, 0)', width: '100%', height: '10vh', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'flex-start', justifyContent: 'flex-start', paddingLeft: '1%', paddingRight: '1%', paddingTop: '1vh', borderRadius: '8px', border: 'none', outline: 'none', resize: 'none', overflow: 'auto'}} value = {description1} onFocus = {(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur = {(event) => (event.target.style.borderColor = 'rgba(0, 0, 0, 0)')}></textarea>
                </div>

                <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', gap: '2%'}}>

                  <div style = {{width: '50%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5vh'}}>
                    <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1%'}}>
                      <input type = "checkbox" checked = {grouplimitenabled == 1} onChange = {() => {if (grouplimitenabled == 0) {setGrouplimitenabled(1);} else {setGrouplimitenabled(0); setGrouplimit('');}}} style = {{cursor: 'pointer'}}/>
                      <div style = {{color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', gap: '0.5vw'}}>Limit sztuk na grupę<InfoTooltip text = "Ogranicza łaczną liczbę sztuk dostępnych w sklepie." /></div>
                    </div>
                    <input onInput = {(event) => onNumericinput(event.target.value, setGrouplimit)} disabled = {grouplimitenabled == 0} style = {{backgroundColor: 'rgb(40, 40, 52)', border: '2px solid rgba(0, 0, 0, 0)', width: '100%', height: '5vh', position: 'relative', color: grouplimitenabled == 1 ? 'rgb(227, 224, 247)' : 'rgb(100, 100, 100)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', borderRadius: '8px', border: 'none', outline: 'none', paddingRight: '1%', textAlign: 'left', opacity: grouplimitenabled == 1 ? 1 : 0.5}} value = {grouplimit} onFocus = {(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur = {(event) => (event.target.style.borderColor = 'rgba(0, 0, 0, 0)')}></input>
                  </div>
                  <div style = {{width: '50%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5vh'}}>
                    <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1%'}}>
                      <input type = "checkbox" checked = {studentlimitenabled == 1} onChange = {() => {if (studentlimitenabled == 0) {setStudentlimitenabled(1);} else {setStudentlimitenabled(0); setStudentlimit('');}}} style = {{cursor: 'pointer'}}/>
                      <div style = {{color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', gap: '0.5vw'}}>Limit sztuk na studenta<InfoTooltip text = "Ogranicza ile razy każdy z użytkowników może kupić ten przedmiot." /></div>
                    </div>
                    <input onInput = {(event) => onNumericinput(event.target.value, setStudentlimit)} disabled = {studentlimitenabled == 0} style = {{backgroundColor: 'rgb(40, 40, 52)', border: '2px solid rgba(0, 0, 0, 0)', width: '100%', height: '5vh', position: 'relative', color: studentlimitenabled == 1 ? 'rgb(227, 224, 247)' : 'rgb(100, 100, 100)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', borderRadius: '8px', border: 'none', outline: 'none', paddingRight: '1%', textAlign: 'left', opacity: studentlimitenabled == 1 ? 1 : 0.5}} value = {studentlimit} onFocus = {(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur = {(event) => (event.target.style.borderColor = 'rgba(0, 0, 0, 0)')}></input>
                  </div>
                </div>

                <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5vh', paddingTop: '1vh'}}>
                  <div onClick = {() => togglecategoriesopen()} style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', paddingLeft: '1%', paddingRight: '1%'}}>
                    <div style = {{color: 'rgb(227, 224, 247)', fontSize: '18px', display: 'flex', fontWeight: 900, alignItems: 'center', gap: '0.5vw'}}>Kategorie<InfoTooltip text = "Każdy z przedmiotów może zostać zaklasyfikowany do jednej z wybranych kategorii w celu ułatwienia filtrowania przedmiotów." /></div>
                    <img src = {categoriesopen == 1 ? up : down} style = {{width: '20px', height: '20px'}}/>
                  </div>

                  {categoriesopen == 1 ? (
                    <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5vh', paddingTop: '0.5vh'}}>
                      {categories.map((category) => (
                        <div key = {'category' + category.id} style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1%', paddingTop: '0.5vh', paddingBottom: '0.5vh', paddingLeft: '1%'}}>
                          <input type = "checkbox" checked = {category.checked == 1} onChange = {() => oncategorycheckchange(category.id)} style = {{cursor: 'pointer'}}/>
                          {category.editmode == 1 ? (
                            <input onChange = {(event) => oncategorynamechange(category.id, event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', border: '2px solid rgba(0, 0, 0, 0)', width: getcategoryinputwidth(category.tempname), height: '4vh', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', borderRadius: '8px', border: 'none', outline: 'none'}} value = {category.tempname} onFocus = {(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur = {(event) => (event.target.style.borderColor = 'rgba(0, 0, 0, 0)')}></input>
                          ) : (
                            <div style = {{width: '90%', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{category.name}</div>
                          )}
                          {category.editmode == 1 ? (
                            <div onClick = {() => saveeditcategory(category.id)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '4vh', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                              <img src = {checkicon} style = {{width: '50%', height: '50%'}}/>
                            </div>
                          ) : (
                            <div onClick = {() => starteditcategory(category.id)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '4vh', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                              <img src = {editicon} style = {{width: '50%', height: '50%'}}/>
                            </div>
                          )}
                          {category.editmode == 1 ? (
                            <div onClick = {() => canceleditcategory(category.id)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '4vh', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                              <img src = {closeicon} style = {{width: '50%', height: '50%'}}/>
                            </div>
                          ) : (
                            <div onClick = {() => deletecategory(category.id)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '4vh', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                              <img src = {deleteicon} style = {{width: '50%', height: '50%'}}/>
                            </div>
                          )}
                        </div>
                      ))}

                      {addingcategory == 1 ? (
                        <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1%', paddingTop: '0.5vh', paddingBottom: '0.5vh', paddingLeft: '1%'}}>
                          <input onChange = {(event) => setNewcategoryname(event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', border: '2px solid rgba(0, 0, 0, 0)', width: '90%', height: '4vh', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', borderRadius: '8px', border: 'none', outline: 'none'}} value = {newcategoryname} onFocus = {(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur = {(event) => (event.target.style.borderColor = 'rgba(0, 0, 0, 0)')}></input>
                          <div onClick = {() => confirmaddcategory()} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '4vh', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                            <img src = {checkicon} style = {{width: '50%', height: '50%'}}/>
                          </div>
                          <div onClick = {() => canceladdcategory()} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '4vh', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                            <img src = {closeicon} style = {{width: '50%', height: '50%'}}/>
                          </div>
                        </div>
                      ) : (
                        <div onClick = {() => setAddingcategory(1)} style = {{backgroundColor: 'rgba(30, 204, 56)', width: '25%', position: 'relative', borderRadius: '8px', color: 'rgb(0, 57, 21)', fontSize: '16px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', paddingTop: '1vh', paddingBottom: '1vh'}}>Dodaj kategorię</div>
                        
                      )}
                    </div>
                  ) : null}
                </div>

              </div>

              <div style = {{backgroundColor: 'rgb(26, 26, 42)', width: '100%', position: 'relative', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1.5vh', paddingTop: '2vh', paddingBottom: '2vh', paddingLeft: '2%', paddingRight: '2%'}}>
                <div style = {{width: '100%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '18px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', paddingBottom: '1vh', gap: '0.5vw'}}>Zniżki za odznaki<InfoTooltip text = "Wpisanie znaku '%' w wartości sprawia, że zniżka staje się procentowa." /></div>

                <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2%', flexWrap: 'wrap'}}>
                  <select onChange = {(event) => setSelectedbadge(event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '40%', height: '5vh', position: 'relative', color: 'rgb(66, 243, 125)', fontSize: '14px', fontWeight: 900, paddingLeft: '2%', border: 'none', outline: 'none', borderRadius: '8px', cursor: 'pointer'}} value = {selectedbadge}>
                    <option value = 'Wybierz odznakę'>Wybierz odznakę</option>
                    {badges.map((badge) => (
                      <option key = {'badgeoption' + badge.id} value = {badge.name}>{badge.name}</option>
                    ))}
                  </select>
                  <input onInput = {(event) => onDiscountinput(event.target.value, setPendingdiscountvalue)} style = {{backgroundColor: 'rgb(40, 40, 52)', border: '2px solid rgba(0, 0, 0, 0)', width: '30%', height: '5vh', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', borderRadius: '8px', border: 'none', outline: 'none', textAlign: 'center'}} value = {pendingdiscountvalue} onFocus = {(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur = {(event) => (event.target.style.borderColor = 'rgba(0, 0, 0, 0)')}></input>
                  <div onClick = {() => addbadgediscount()} style = {{backgroundColor: 'rgba(30, 204, 56)', width: '25%', position: 'relative', borderRadius: '8px', color: 'rgb(0, 57, 21)', fontSize: '16px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', paddingTop: '1vh', paddingBottom: '1vh'}}>Dodaj zniżkę</div>
                </div>
                {badgediscounts.map((discount) => (
                  <div key = {'badgediscount' + discount.id} style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2%'}}>
                    <div style = {{backgroundColor: 'rgb(41, 40, 57)', width: '40%', height: '5vh', position: 'relative', borderRadius: '8px', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', paddingLeft: '2%'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{discount.badgename}</span></div>
                    <input onInput = {(event) => onDiscountinput(event.target.value, (value) => onbadgediscountchange(discount.id, value))} style = {{backgroundColor: 'rgb(40, 40, 52)', border: '2px solid rgba(0, 0, 0, 0)', width: '50%', height: '5vh', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', borderRadius: '8px', border: 'none', outline: 'none', textAlign: 'center'}} value = {discount.value} onFocus = {(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur = {(event) => (event.target.style.borderColor = 'rgba(0, 0, 0, 0)')}></input>
                    <div onClick = {() => deletebadgediscount(discount.id)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '5%', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                      <img src = {deleteicon} style = {{width: '35%', height: '35%'}}/>
                    </div>
                  </div>
                ))}
              </div>

              <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: '2%'}}>
                <div onClick = {() => goback()} style = {{backgroundColor: 'rgb(26, 26, 42)', width: '15%', position: 'relative', borderRadius: '8px', color: 'rgb(227, 224, 247)', fontSize: '16px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', paddingTop: '1vh', paddingBottom: '1vh'}}>Cofnij</div>
                <div onClick = {() => createitem()} style = {{backgroundColor: 'rgba(30, 204, 56)', width: '20%', position: 'relative', borderRadius: '8px', color: 'rgb(0, 57, 21)', fontSize: '16px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', paddingTop: '1vh', paddingBottom: '1vh'}}>Stwórz przedmiot</div>
              </div>

            </div>

            <div style = {{width: '25%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '2vh'}}>

              <div style = {{width: '100%', position: 'relative', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1vh', paddingTop: '2vh', paddingBottom: '2vh', paddingLeft: '2%', paddingRight: '2%'}}>
                <div style = {{width: '100%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '18px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', paddingBottom: '1vh', gap: '0.5vw'}}>Zniżki za rangi{ranksfrombackend == 0 ? '*' : ''}<InfoTooltip text = "Choć cena finalna w przypadku posiadania przez studenta danej rangi obliczana jest automatycznie, można ją nadpisać." /></div>
                {ranks.length == 0 ? (
                  <div style = {{width: '100%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}>Brak rang w grupie.</div>
                ) : (
                  ranks.map((rank) => (
                    <div key = {'rank' + rank.id} style = {{backgroundColor: 'rgb(26, 26, 42)', width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '1vh', paddingTop: '3%', paddingBottom: '3%', paddingLeft: '2.5%', paddingRight: '2.5%', borderRadius: '16px'}}>
                      <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2%'}}>
                        <div style = {{backgroundColor: 'rgb(40, 40, 52)', width: '15%', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%'}}>
                          <AssetSvg name = {resolveSvgAssetName(rank.icon)} width = {32} height = {32}/>
                        </div>
                        <div style = {{width: '75%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', left: '2.5%', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start'}}><span style = {{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{rank.name}</span></div>

                      </div>
                      <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: '2%'}}>
                        <input onInput = {(event) => onNumericinput(event.target.value, (value) => onrankcostchange(rank.id, value))} style = {{backgroundColor: 'rgb(40, 40, 56)', border: '2px solid rgba(0, 0, 0, 0)', width: '100%', height: '4vh', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'center', paddingLeft: '1%', borderRadius: '8px', border: 'none', outline: 'none', paddingRight: '1%', textAlign: 'center'}} value = {rank.costafter} onFocus = {(event) => (event.target.style.border = '2px solid rgb(66, 243, 125)')} onBlur = {(event) => (event.target.style.borderColor = 'rgba(0, 0, 0, 0)')}></input>
                        <div style = {{width: '30%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>{rank.discount}%</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  )
}


