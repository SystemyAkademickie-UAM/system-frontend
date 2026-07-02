import { useState, useEffect, useRef } from 'react';
import {useParams} from 'react-router-dom';
import {getApiBaseUrl} from '../../../constants/api.constants.js';
import {getOrCreateBrowserId} from '../../../auth/browserIdStorage.js';
import {Button, CharacterLimitedField, Divider, InfoTooltip, useToast} from '../../../components/ui/index.js';
import { NAME_MAX_LENGTH, SHORT_DESCRIPTION_MAX_LENGTH } from '../../../constants/fieldLimits.js';
import EmojiPickerField from '../../../components/ui/EmojiPickerField/EmojiPickerField.jsx';
import LivesIcon from '../../../components/ui/Lives/LivesIcon.jsx';
import RewardsCurrencyLabel from '../group-rewards/shared/RewardsCurrencyLabel.jsx';
import {createGroupShopItem, fetchGroupShopItems, updateGroupShopItem} from '../../../services/shop.api.js';
import {syncShopItemRankUnlock, findRankUnlockingItem} from '../../../utils/ranks/rankShopItemUnlock.js';
import { EXTRA_LIFE_ICON_EDIT_TOOLTIP } from '../../../utils/shop/extraLifeItem.js';
import { sanitizeWholeNumberInput } from '../../../utils/validation/rewardsNumericValidation.js';
import '../group-shop/modals/ShopItemFormModal.css';

export default function ShopItemFormContent({
  groupId: groupIdProp,
  itemId = null,
  onClose,
  onSaved,
}) {

  const {showSuccess, showError} = useToast();

  const routeParams = useParams();
  const groupId = groupIdProp ?? routeParams.groupId;
  const editingItemId = itemId != null && itemId !== '' ? String(itemId) : null;
  const [isEditingExtraLife, setIsEditingExtraLife] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [currenticon, setCurrenticon] = useState('🥕');
  const [iconbackground, setIconbackground] = useState('rgb(40,40,52)');

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
  const editFormHydratedRef = useRef(null);
  const pendingEditCategoryIdsRef = useRef(null);

  const [ranks, setRanks] = useState([]);
  const [ranksfrombackend, setRanksfrombackend] = useState(0);
  const [unlockRankId, setUnlockRankId] = useState('');

  const [badges, setBadges] = useState([]);
  const [badgediscounts, setBadgediscounts] = useState([]);
  const [selectedbadge, setSelectedbadge] = useState('Wybierz odznakę');
  const [pendingdiscountvalue, setPendingdiscountvalue] = useState('');
  const [rankDiscountsExpanded, setRankDiscountsExpanded] = useState(false);



  function onNumericinput(stringvalue, setterfunction) {
    setterfunction(sanitizeWholeNumberInput(stringvalue));
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

      setCategories((current) => {
        const previousById = new Map(current.map((entry) => [String(entry.id), entry]));
        const pendingCategoryIds = pendingEditCategoryIdsRef.current;

        return receiveddata.map((entry) => {
          const previous = previousById.get(String(entry.id));
          let checked = 0;

          if (previous?.checked === 1) {
            checked = 1;
          } else if (pendingCategoryIds?.has(String(entry.id))) {
            checked = 1;
          }

          return {
            id: entry.id,
            name: entry.name,
            color: entry.color ?? null,
            checked,
            editmode: previous?.editmode ?? 0,
            tempname: previous?.tempname ?? entry.name,
          };
        });
      });

      if (pendingEditCategoryIdsRef.current && receiveddata.length > 0) {
        pendingEditCategoryIdsRef.current = null;
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

        let discountvalue = receiveddata[i].globalDiscountType === 'percent'
          ? Number(receiveddata[i].globalDiscountValue ?? 0)
          : Number(receiveddata[i].discount ?? 0);

        if (!Number.isFinite(discountvalue)) {
          discountvalue = 0;
        }

        let iconvalue = receiveddata[i].icon;

        if (iconvalue == null) {
          iconvalue = '';
        }

        receivedranks.push({
          id: receiveddata[i].id,
          icon: iconvalue || '',
          name: receiveddata[i].name,
          discount: discountvalue,
          costafter: '',
          isCustom: 0,
          uniqueStoreItems: receiveddata[i].uniqueStoreItems ?? [],
        });

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
    setCategories((current) => current.map((category) => {
      if (String(category.id) !== String(categoryId)) {
        return category;
      }

      return {
        ...category,
        checked: category.checked === 1 ? 0 : 1,
      };
    }));
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

      newranks.push({
        id: ranks[i].id,
        icon: ranks[i].icon,
        name: ranks[i].name,
        discount: ranks[i].discount,
        costafter: newcostafter,
        isCustom: 0,
        uniqueStoreItems: ranks[i].uniqueStoreItems ?? [],
      });

      i = i + 1;
    }

    setRanks(newranks);
  }





  function onrankcostchange(rankId, value) {

    const newranks = [];

    let i = 0;

    while (i < ranks.length) {

      if (ranks[i].id == rankId) {
        newranks.push({
          id: ranks[i].id,
          icon: ranks[i].icon,
          name: ranks[i].name,
          discount: ranks[i].discount,
          costafter: value,
          isCustom: 1,
          uniqueStoreItems: ranks[i].uniqueStoreItems ?? [],
        });
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
    if (onClose) {
      onClose();
      return;
    }
    window.location.href = '/groups/' + groupId + '/shop';
  }



  function buildItemPayload() {
    const items = {
      name: itemname.trim(),
      basePrice: Number(cost),
    };

    if (!isEditingExtraLife) {
      items.imageRef = currenticon + '*' + iconbackground;
    }

    if (description0.trim().length > 0) {
      items.storyDescription = description0.trim();
    }

    if (description1.trim().length > 0) {
      items.educationalDescription = description1.trim();
    }

    let categoryIds = [];
    let i = 0;
    while (i < categories.length) {
      if (categories[i].checked == 1) {
        categoryIds.push(categories[i].id);
      }
      i = i + 1;
    }

    if (categoryIds.length > 0) {
      items.categoryIds = categoryIds;
    } else if (editingItemId) {
      items.categoryId = null;
    }

    if (grouplimitenabled == 1) {
      items.stockQuantity = Number(grouplimit);
    } else if (editingItemId) {
      items.stockQuantity = null;
    }

    if (studentlimitenabled == 1) {
      items.perStudentLimit = Number(studentlimit);
    } else if (editingItemId) {
      items.perStudentLimit = null;
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

    return items;
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
      const items = buildItemPayload();
      const saveResult = editingItemId
        ? await updateGroupShopItem(groupId, editingItemId, items)
        : await createGroupShopItem(groupId, items);

      if (!saveResult.ok) {
        showError(saveResult.error ?? 'Nie udało się zapisać przedmiotu.');
        return;
      }

      const savedItemId = editingItemId ?? saveResult.item?.id ?? null;
      if (savedItemId) {
        const rankRefs = ranks.map((rankEntry) => ({
          dbId: rankEntry.id,
          name: rankEntry.name,
          shopItems: rankEntry.uniqueStoreItems || [],
        }));
        const rankResult = await syncShopItemRankUnlock(
          groupId,
          String(savedItemId),
          unlockRankId === '' ? null : Number(unlockRankId),
          rankRefs,
        );
        if (!rankResult.ok) {
          showError(rankResult.error ?? 'Przedmiot zapisany, ale nie udało się przypisać blokady rangi.');
          return;
        }
      }

      showSuccess(editingItemId ? 'Przedmiot został zaktualizowany!' : 'Przedmiot został utworzony!');
      if (onSaved) {
        onSaved();
      } else {
        window.location.href = '/groups/' + groupId + '/shop';
      }

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

  }, [groupId]);



  useEffect(() => {
    if (!editingItemId) {
      setIsEditingExtraLife(false);
      editFormHydratedRef.current = null;
      pendingEditCategoryIdsRef.current = null;
    }
  }, [editingItemId]);

  useEffect(() => {
    if (!editingItemId || ranksfrombackend !== 1) {
      return undefined;
    }

    let cancelled = false;

    (async () => {
      const result = await fetchGroupShopItems(groupId);
      if (!result.ok || cancelled) {
        return;
      }

      const item = result.items.find((entry) => entry.id === editingItemId);
      if (!item || cancelled) {
        return;
      }

      if (editFormHydratedRef.current === editingItemId) {
        return;
      }

      editFormHydratedRef.current = editingItemId;

      setIsEditingExtraLife(item.isExtraLife === true);

      const imageParts = String(item.imageRef ?? '').split('*');
      if (imageParts[0]) {
        setCurrenticon(imageParts[0]);
      }
      if (imageParts[1]) {
        setIconbackground(imageParts[1]);
      }

      const priceAmount = String(item.priceAmount ?? '');
      const baseCost = Number(priceAmount);

      setItemname(item.name ?? '');
      setDescription0(item.storyDescription ?? '');
      setDescription1(item.didacticDescription ?? '');
      setCost(priceAmount);

      if (item.stockQuantity != null) {
        setGrouplimitenabled(1);
        setGrouplimit(String(item.stockQuantity));
      } else {
        setGrouplimitenabled(0);
        setGrouplimit('');
      }

      if (item.perStudentLimit != null) {
        setStudentlimitenabled(1);
        setStudentlimit(String(item.perStudentLimit));
      } else {
        setStudentlimitenabled(0);
        setStudentlimit('');
      }

      const selectedCategoryIds = new Set((item.categories ?? []).map((categoryId) => String(categoryId)));
      pendingEditCategoryIdsRef.current = selectedCategoryIds;

      setCategories((current) => {
        if (current.length === 0) {
          return current;
        }

        return current.map((category) => ({
          ...category,
          checked: selectedCategoryIds.has(String(category.id)) ? 1 : 0,
        }));
      });

      let unlockRankValue = '';

      setRanks((current) => {
        const rankRefs = current.map((rankEntry) => ({
          dbId: rankEntry.id,
          name: rankEntry.name,
          shopItems: rankEntry.uniqueStoreItems || [],
        }));
        const owningRank = findRankUnlockingItem(editingItemId, rankRefs);
        unlockRankValue = owningRank ? String(owningRank.dbId) : '';

        return current.map((rankEntry) => {
          const promo = (item.rankPromotions ?? []).find((entry) => (entry.rankId ?? entry.id) === rankEntry.id);
          if (promo) {
            const costafter = Math.max(0, baseCost - Number(promo.value ?? 0));
            return {
              ...rankEntry,
              costafter: String(costafter),
              isCustom: 1,
            };
          }

          let costafter = '';
          if (priceAmount !== '' && baseCost > 0) {
            let discounted = baseCost - Math.round(baseCost * rankEntry.discount / 100);
            if (discounted < 0) {
              discounted = 0;
            }
            costafter = String(discounted);
          }

          return {
            ...rankEntry,
            costafter,
            isCustom: 0,
          };
        });
      });
      setUnlockRankId(unlockRankValue);

      const loadedBadgeDiscounts = (item.badgePromotions ?? []).map((promo, index) => {
        const badgeId = promo.badgeId ?? promo.id;
        const badge = badges.find((entry) => entry.id === badgeId);
        const value = promo.promotionType === 'percent'
          ? `${promo.value}%`
          : String(promo.value);
        return {
          id: index,
          badgeid: badgeId,
          badgename: badge?.name ?? `Odznaka ${badgeId}`,
          value,
        };
      });
      setBadgediscounts(loadedBadgeDiscounts);
    })();

    return () => {
      cancelled = true;
    };
  }, [badges, editingItemId, groupId, ranksfrombackend]);



  return (
    <div className="shop-item-form">
      {errorMessage ? (
        <p className="shop-item-form__error" role="alert">{errorMessage}</p>
      ) : null}

      <div className="shop-item-form__layout">
        <div className="shop-item-form__main">
          <section className="shop-item-form__panel">
            <div className="shop-item-form__row shop-item-form__row--name-price">
              <div className="shop-item-form__field">
                <label className="shop-item-form__label" htmlFor="shop-item-name">Nazwa przedmiotu*</label>
                <CharacterLimitedField value={itemname} maxLength={NAME_MAX_LENGTH}>
                  <input
                    id="shop-item-name"
                    className="shop-item-form__input"
                    value={itemname}
                    maxLength={NAME_MAX_LENGTH}
                    onChange={(event) => setItemname(event.target.value)}
                  />
                </CharacterLimitedField>
              </div>
              <div className="shop-item-form__field shop-item-form__field--price">
                <RewardsCurrencyLabel htmlFor="shop-item-price" className="shop-item-form__label">
                  Cena*
                </RewardsCurrencyLabel>
                <input
                  id="shop-item-price"
                  className="shop-item-form__input"
                  value={cost}
                  onInput={(event) => {
                    onNumericinput(event.target.value, setCost);
                    recalculatediscounts(event.target.value);
                  }}
                />
              </div>
            </div>

            {isEditingExtraLife ? (
              <div className="shop-item-form__icon-picker shop-item-form__icon-picker--locked">
                <span className="shop-item-form__label">
                  Ikona przedmiotu
                  <InfoTooltip text={EXTRA_LIFE_ICON_EDIT_TOOLTIP} />
                </span>
                <div
                  className="shop-item-form__icon-locked"
                  aria-disabled="true"
                  title={EXTRA_LIFE_ICON_EDIT_TOOLTIP}
                >
                  <LivesIcon size="lg" ariaLabel="Ikona systemu żyć" />
                </div>
              </div>
            ) : (
              <EmojiPickerField
                className="shop-item-form__icon-picker"
                label="Ikona przedmiotu"
                value={currenticon}
                defaultEmoji="🥕"
                onChange={setCurrenticon}
                ariaLabel="Wybierz ikonę przedmiotu"
              />
            )}

            <div className="shop-item-form__field">
              <span className="shop-item-form__label shop-item-form__label--heading">
                Kategoria
                <InfoTooltip text="Przedmiot może należeć do wielu kategorii — kolory kategorii mieszają się na kafelku produktu." />
              </span>
              {categories.length === 0 ? (
                <p className="shop-item-form__empty">Brak kategorii — dodaj je w sklepie.</p>
              ) : (
                <ul className="shop-item-form__category-list">
                  {categories.map((category) => (
                    <li key={`category-${category.id}`}>
                      <label className="shop-item-form__category-option">
                        <input
                          type="checkbox"
                          checked={category.checked === 1}
                          onChange={() => oncategorycheckchange(category.id)}
                        />
                        <span
                          className="shop-item-form__category-swatch"
                          style={{ backgroundColor: category.color ?? '#42f37d' }}
                          aria-hidden="true"
                        />
                        <span>{category.name}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <Divider />

          <section className="shop-item-form__panel">
            <div className="shop-item-form__field">
              <label className="shop-item-form__label" htmlFor="shop-item-story">Opis fabularny</label>
              <CharacterLimitedField value={description0} maxLength={SHORT_DESCRIPTION_MAX_LENGTH}>
                <textarea
                  id="shop-item-story"
                  className="shop-item-form__textarea"
                  value={description0}
                  maxLength={SHORT_DESCRIPTION_MAX_LENGTH}
                  onChange={(event) => setDescription0(event.target.value)}
                />
              </CharacterLimitedField>
            </div>
            <div className="shop-item-form__field">
              <label className="shop-item-form__label" htmlFor="shop-item-edu">Opis dydaktyczny</label>
              <CharacterLimitedField value={description1} maxLength={SHORT_DESCRIPTION_MAX_LENGTH}>
                <textarea
                  id="shop-item-edu"
                  className="shop-item-form__textarea"
                  value={description1}
                  maxLength={SHORT_DESCRIPTION_MAX_LENGTH}
                  onChange={(event) => setDescription1(event.target.value)}
                />
              </CharacterLimitedField>
            </div>
          </section>

          <Divider />

          <section className="shop-item-form__panel">
            <div className="shop-item-form__field">
              <label className="shop-item-form__label" htmlFor="shop-item-unlock-rank">
                Dostępność
                <InfoTooltip text="Domyślnie przedmiot jest dostępny dla wszystkich. Wyższa ranga odblokowuje też przedmioty niższych rang." />
              </label>
              <select
                id="shop-item-unlock-rank"
                className="shop-item-form__select"
                value={unlockRankId}
                onChange={(event) => setUnlockRankId(event.target.value)}
              >
                <option value="">Dostępny dla wszystkich</option>
                {ranks.map((rank) => (
                  <option key={`unlock-rank-${rank.id}`} value={String(rank.id)}>
                    {`Dostępny po osiągnięciu rangi: ${rank.name}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="shop-item-form__row shop-item-form__row--limits">
              <div className="shop-item-form__field">
                <label className="shop-item-form__limit-toggle" htmlFor="shop-item-group-limit-enabled">
                  <input
                    id="shop-item-group-limit-enabled"
                    type="checkbox"
                    checked={grouplimitenabled === 1}
                    onChange={() => {
                      if (grouplimitenabled === 0) {
                        setGrouplimitenabled(1);
                      } else {
                        setGrouplimitenabled(0);
                        setGrouplimit('');
                      }
                    }}
                  />
                  <span>
                    Limit sztuk na grupę
                    <InfoTooltip text="Ogranicza łączną liczbę sztuk dostępnych w sklepie." />
                  </span>
                </label>
                <input
                  className="shop-item-form__input"
                  value={grouplimit}
                  disabled={grouplimitenabled === 0}
                  onInput={(event) => onNumericinput(event.target.value, setGrouplimit)}
                />
              </div>
              <div className="shop-item-form__field">
                <label className="shop-item-form__limit-toggle" htmlFor="shop-item-student-limit-enabled">
                  <input
                    id="shop-item-student-limit-enabled"
                    type="checkbox"
                    checked={studentlimitenabled === 1}
                    onChange={() => {
                      if (studentlimitenabled === 0) {
                        setStudentlimitenabled(1);
                      } else {
                        setStudentlimitenabled(0);
                        setStudentlimit('');
                      }
                    }}
                  />
                  <span>
                    Limit sztuk na studenta
                    <InfoTooltip text="Ogranicza ile razy każdy z użytkowników może kupić ten przedmiot." />
                  </span>
                </label>
                <input
                  className="shop-item-form__input"
                  value={studentlimit}
                  disabled={studentlimitenabled === 0}
                  onInput={(event) => onNumericinput(event.target.value, setStudentlimit)}
                />
              </div>
            </div>
          </section>

          <Divider />

          <section className="shop-item-form__panel">
            <span className="shop-item-form__label shop-item-form__label--heading">
              Zniżki za odznaki
              <InfoTooltip text="Wpisanie znaku '%' w wartości sprawia, że zniżka staje się procentowa." />
            </span>

            <div className="shop-item-form__badge-toolbar">
              <select
                className="shop-item-form__select"
                value={selectedbadge}
                onChange={(event) => setSelectedbadge(event.target.value)}
              >
                <option value="Wybierz odznakę">Wybierz odznakę</option>
                {badges.map((badge) => (
                  <option key={`badgeoption-${badge.id}`} value={badge.name}>{badge.name}</option>
                ))}
              </select>
              <input
                className="shop-item-form__input"
                value={pendingdiscountvalue}
                onInput={(event) => onDiscountinput(event.target.value, setPendingdiscountvalue)}
              />
              <Button type="button" variant="primary" size="md" onClick={addbadgediscount}>
                Dodaj zniżkę
              </Button>
            </div>

            {badgediscounts.map((discount) => (
              <div key={`badgediscount-${discount.id}`} className="shop-item-form__badge-row">
                <span className="shop-item-form__badge-name">{discount.badgename}</span>
                <input
                  className="shop-item-form__input"
                  value={discount.value}
                  onInput={(event) => onDiscountinput(
                    event.target.value,
                    (value) => onbadgediscountchange(discount.id, value),
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => deletebadgediscount(discount.id)}
                >
                  Usuń
                </Button>
              </div>
            ))}
          </section>
        </div>

        <aside className="shop-item-form__sidebar">
          <section
            className={[
              'shop-item-form__panel',
              'shop-item-form__panel--rank-discounts',
              rankDiscountsExpanded ? 'shop-item-form__panel--rank-discounts-expanded' : '',
            ].filter(Boolean).join(' ')}
          >
            <div className="shop-item-form__rank-discounts-header">
              <button
                type="button"
                className="shop-item-form__rank-discounts-toggle"
                onClick={() => setRankDiscountsExpanded((expanded) => !expanded)}
                aria-expanded={rankDiscountsExpanded}
                aria-controls="shop-item-rank-discounts-list"
              >
                <span className="shop-item-form__rank-discounts-chevron" aria-hidden="true" />
                <span className="shop-item-form__label shop-item-form__label--heading shop-item-form__label--toggle">
                  Zniżki za rangi
                  {ranksfrombackend === 0 ? '*' : ''}
                </span>
              </button>
              <InfoTooltip text="Choć cena finalna w przypadku posiadania przez studenta danej rangi obliczana jest automatycznie, można ją nadpisać." />
            </div>

            {rankDiscountsExpanded ? (
              ranks.length === 0 ? (
                <p className="shop-item-form__empty">Brak rang w grupie.</p>
              ) : (
                <div id="shop-item-rank-discounts-list" className="shop-item-form__rank-list">
                  {ranks.map((rank) => (
                    <div key={`rank-${rank.id}`} className="shop-item-form__rank-card">
                      <span className="shop-item-form__rank-icon" aria-hidden="true">
                        {rank.icon || '⭐'}
                      </span>
                      <span className="shop-item-form__rank-name">{rank.name}</span>
                      <input
                        className="shop-item-form__input shop-item-form__rank-price-input"
                        value={rank.costafter}
                        onInput={(event) => onNumericinput(
                          event.target.value,
                          (value) => onrankcostchange(rank.id, value),
                        )}
                      />
                      <span className="shop-item-form__rank-discount">{rank.discount}%</span>
                    </div>
                  ))}
                </div>
              )
            ) : null}
          </section>
        </aside>
      </div>

      <div className="shop-item-form__footer">
        <Button type="button" variant="secondary" size="md" onClick={goback}>
          Cofnij
        </Button>
        <Button type="button" variant="primary" size="md" onClick={createitem}>
          {editingItemId ? 'Zapisz zmiany' : 'Stwórz przedmiot'}
        </Button>
      </div>
    </div>
  );
}


