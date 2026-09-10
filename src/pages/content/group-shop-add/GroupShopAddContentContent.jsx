import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useParams } from 'react-router-dom';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../../../auth/browserIdStorage.js';
import { Button, useToast } from '../../../components/ui/index.js';
import { createGroupShopItem, fetchGroupShopItems, updateGroupShopItem } from '../../../services/shop.api.js';
import { syncShopItemRankUnlock, findRankUnlockingItem } from '../../../utils/ranks/rankShopItemUnlock.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import ShopItemWizardHeader from './steps/ShopItemWizardHeader.jsx';
import ShopItemStepInfo from './steps/ShopItemStepInfo.jsx';
import ShopItemStepPricing from './steps/ShopItemStepPricing.jsx';
import ShopItemStepAvailability from './steps/ShopItemStepAvailability.jsx';
import ShopItemStepSummary from './steps/ShopItemStepSummary.jsx';
import ShopItemUnsavedModal from './modals/ShopItemUnsavedModal.jsx';
import ShopItemDraftPromptModal from './modals/ShopItemDraftPromptModal.jsx';
import '../group-shop/modals/ShopItemFormModal.css';

const DRAFT_STORAGE_KEY_PREFIX = 'maq_shop_item_draft_';

const TOTAL_STEPS = 4;

const ShopItemFormContent = forwardRef(function ShopItemFormContent({
  groupId: groupIdProp,
  itemId = null,
  onClose,
  onSaved,
  onStepChange,
  hideInternalHeader = false,
}, ref) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const { showSuccess, showError } = useToast();

  const routeParams = useParams();
  const groupId = groupIdProp ?? routeParams.groupId;
  const editingItemId = itemId != null && itemId !== '' ? String(itemId) : null;
  const draftKey = `${DRAFT_STORAGE_KEY_PREFIX}${groupId}${editingItemId ? `_${editingItemId}` : ''}`;

  // Krok kreatora (1 - Informacje, 2 - Wartość, 3 - Dostępność, 4 - Podsumowanie)
  const [currentStep, setCurrentStepState] = useState(editingItemId ? 4 : 1);

  const setCurrentStep = useCallback((stepOrFn) => {
    setCurrentStepState((prev) => {
      const next = typeof stepOrFn === 'function' ? stepOrFn(prev) : stepOrFn;
      if (onStepChange) {
        onStepChange(next);
      }
      return next;
    });
  }, [onStepChange]);

  // Stany formularza - Krok 1 (Informacje)
  const [itemName, setItemName] = useState('');
  const [currentIcon, setCurrentIcon] = useState('🥕');
  const [iconBackground, setIconBackground] = useState('rgb(40,40,52)');
  const [isEditingExtraLife, setIsEditingExtraLife] = useState(false);
  const [storyDescription, setStoryDescription] = useState('');
  const [didacticDescription, setDidacticDescription] = useState('');
  const [categories, setCategories] = useState([]);

  // Stany formularza - Krok 2 (Wartość)
  const [cost, setCost] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [minPriceEnabled, setMinPriceEnabled] = useState(false);
  const [badges, setBadges] = useState([]);
  const [badgeDiscounts, setBadgeDiscounts] = useState([]);
  const [ranks, setRanks] = useState([]);
  const [ranksFromBackend, setRanksFromBackend] = useState(0);

  // Stany formularza - Krok 3 (Dostępność)
  const [isVisible, setIsVisible] = useState(false); // Domyślnie ukryty
  const [restrictRankEnabled, setRestrictRankEnabled] = useState(false);
  const [unlockRankId, setUnlockRankId] = useState('');
  const [groupLimitEnabled, setGroupLimitEnabled] = useState(false);
  const [groupLimit, setGroupLimit] = useState('');
  const [studentLimitEnabled, setStudentLimitEnabled] = useState(false);
  const [studentLimit, setStudentLimit] = useState('');

  // Błędy walidacji
  const [nameError, setNameError] = useState('');
  const [costError, setCostError] = useState('');
  const [groupLimitError, setGroupLimitError] = useState('');
  const [studentLimitError, setStudentLimitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modale potwierdzenia / wersji roboczej
  const [isUnsavedModalOpen, setIsUnsavedModalOpen] = useState(false);
  const [isDraftPromptOpen, setIsDraftPromptOpen] = useState(false);
  const editFormHydratedRef = useRef(null);
  const pendingEditCategoryIdsRef = useRef(null);

  // --- API: Pobieranie kategorii ---
  const fetchCategories = useCallback(async () => {
    try {
      const base = getApiBaseUrl();
      const browserId = getOrCreateBrowserId();
      const response = await fetch(`${base}/groups/${groupId}/item-categories`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserId,
        },
      });

      if (!response.ok) return;
      const data = await response.json();
      const received = Array.isArray(data) ? data : [];

      setCategories((current) => {
        const prevMap = new Map(current.map((c) => [String(c.id), c]));
        const pendingIds = pendingEditCategoryIdsRef.current;

        return received.map((c) => {
          const prev = prevMap.get(String(c.id));
          let checked = 0;
          if (prev?.checked === 1) {
            checked = 1;
          } else if (pendingIds?.has(String(c.id))) {
            checked = 1;
          }
          return {
            id: c.id,
            name: c.name,
            color: c.color ?? null,
            checked,
          };
        });
      });

      if (pendingEditCategoryIdsRef.current && received.length > 0) {
        pendingEditCategoryIdsRef.current = null;
      }
    } catch {
      // ignore
    }
  }, [groupId]);

  // --- API: Tworzenie kategorii ---
  const handleCreateCategory = async (name) => {
    try {
      const base = getApiBaseUrl();
      const browserId = getOrCreateBrowserId();
      const response = await fetch(`${base}/groups/${groupId}/item-categories`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserId,
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        showSuccess('Kategoria została utworzona.');
        await fetchCategories();
        return true;
      }
      showError('Nie udało się utworzyć kategorii.');
      return false;
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Błąd tworzenia kategorii.');
      return false;
    }
  };

  // --- API: Aktualizacja kategorii ---
  const handleUpdateCategory = async (categoryId, payload) => {
    try {
      const base = getApiBaseUrl();
      const browserId = getOrCreateBrowserId();
      const body = typeof payload === 'string' ? { name: payload } : payload;
      const response = await fetch(`${base}/groups/${groupId}/item-categories/${categoryId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserId,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        showSuccess('Kategoria została zaktualizowana.');
        await fetchCategories();
        return true;
      }
      showError('Nie udało się zaktualizować kategorii.');
      return false;
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Błąd aktualizacji kategorii.');
      return false;
    }
  };

  // --- API: Usunięcie kategorii ---
  const handleDeleteCategory = async (categoryId) => {
    try {
      const base = getApiBaseUrl();
      const browserId = getOrCreateBrowserId();
      const response = await fetch(`${base}/groups/${groupId}/item-categories/${categoryId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserId,
        },
      });

      if (response.ok) {
        showSuccess('Kategoria została usunięta.');
        await fetchCategories();
        return true;
      }
      showError('Nie udało się usunąć kategorii.');
      return false;
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Błąd usuwania kategorii.');
      return false;
    }
  };

  const handleCategoryCheckChange = (categoryId) => {
    setCategories((current) => current.map((c) => (
      String(c.id) === String(categoryId) ? { ...c, checked: c.checked === 1 ? 0 : 1 } : c
    )));
  };

  // --- API: Pobieranie rang ---
  const fetchRanks = useCallback(async () => {
    try {
      const base = getApiBaseUrl();
      const browserId = getOrCreateBrowserId();
      const response = await fetch(`${base}/groups/${groupId}/ranks`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserId,
        },
      });

      if (!response.ok) return;
      const data = await response.json();
      const received = Array.isArray(data) ? data : [];

      const mapped = received.map((r) => {
        let discountValue = r.globalDiscountType === 'percent'
          ? Number(r.globalDiscountValue ?? 0)
          : Number(r.discount ?? 0);
        if (!Number.isFinite(discountValue)) discountValue = 0;

        return {
          id: r.id,
          icon: r.icon || '',
          name: r.name,
          discount: discountValue,
          uniqueStoreItems: r.uniqueStoreItems ?? [],
        };
      });

      setRanks(mapped);
      setRanksFromBackend(1);
    } catch {
      // ignore
    }
  }, [groupId]);

  // --- API: Pobieranie odznak ---
  const fetchBadges = useCallback(async () => {
    try {
      const base = getApiBaseUrl();
      const browserId = getOrCreateBrowserId();
      const response = await fetch(`${base}/groups/${groupId}/badges`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserId,
        },
      });

      if (!response.ok) return;
      const data = await response.json();
      const received = Array.isArray(data) ? data : [];
      setBadges(received.map((b) => ({ id: b.id, name: b.name })));
    } catch {
      // ignore
    }
  }, [groupId]);

  // Ładowanie danych początkowych
  useEffect(() => {
    fetchCategories();
    fetchRanks();
    fetchBadges();
  }, [fetchCategories, fetchRanks, fetchBadges]);

  // Sprawdzanie wersji roboczej w localStorage przy tworzeniu nowego przedmiotu
  useEffect(() => {
    if (!editingItemId) {
      try {
        const savedDraft = localStorage.getItem(draftKey);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          if (parsed && (parsed.itemName || parsed.cost || parsed.currentStep > 1)) {
            setIsDraftPromptOpen(true);
          }
        }
      } catch {
        // ignore
      }
    }
  }, [draftKey, editingItemId]);

  // Wczytanie istniejącego przedmiotu do edycji
  useEffect(() => {
    if (!editingItemId || ranksFromBackend !== 1) return;

    let cancelled = false;
    (async () => {
      const result = await fetchGroupShopItems(groupId);
      if (!result.ok || cancelled) return;

      const item = result.items.find((entry) => entry.id === editingItemId);
      if (!item || cancelled) return;
      if (editFormHydratedRef.current === editingItemId) return;
      editFormHydratedRef.current = editingItemId;

      setIsEditingExtraLife(item.isExtraLife === true);
      const imageParts = String(item.imageRef ?? '').split('*');
      if (imageParts[0]) setCurrentIcon(imageParts[0]);
      if (imageParts[1]) setIconBackground(imageParts[1]);

      const priceAmount = String(item.priceAmount ?? '');
      setItemName(item.name ?? '');
      setCost(priceAmount);
      setStoryDescription(item.storyDescription ?? '');
      setDidacticDescription(item.didacticDescription ?? '');

      if (item.minPrice != null) {
        setMinPriceEnabled(true);
        setMinPrice(String(item.minPrice));
      }

      if (item.stockQuantity != null) {
        setGroupLimitEnabled(true);
        setGroupLimit(String(item.stockQuantity));
      }

      if (item.perStudentLimit != null) {
        setStudentLimitEnabled(true);
        setStudentLimit(String(item.perStudentLimit));
      }

      setIsVisible(item.isPublished !== false);

      const selectedCategoryIds = new Set((item.categories ?? []).map(String));
      pendingEditCategoryIdsRef.current = selectedCategoryIds;

      setCategories((current) => {
        if (current.length === 0) return current;
        return current.map((c) => ({
          ...c,
          checked: selectedCategoryIds.has(String(c.id)) ? 1 : 0,
        }));
      });

      setRanks((current) => {
        const rankRefs = current.map((r) => ({
          dbId: r.id,
          name: r.name,
          shopItems: r.uniqueStoreItems || [],
        }));
        const owningRank = findRankUnlockingItem(editingItemId, rankRefs);
        if (owningRank) {
          setRestrictRankEnabled(true);
          setUnlockRankId(String(owningRank.dbId));
        }

        return current;
      });

      const loadedBadgeDiscounts = (item.badgePromotions ?? []).map((promo, index) => {
        const badgeId = promo.badgeId ?? promo.id;
        const badge = badges.find((b) => b.id === badgeId);
        const value = promo.promotionType === 'percent' ? `${promo.value}%` : String(promo.value);
        return {
          id: index,
          badgeid: badgeId,
          badgename: badge?.name ?? `Odznaka ${badgeId}`,
          value,
        };
      });
      setBadgeDiscounts(loadedBadgeDiscounts);
    })();

    return () => {
      cancelled = true;
    };
  }, [badges, editingItemId, groupId, ranksFromBackend]);

  // --- Obsługa wersji roboczej (Draft) ---
  const handleLoadDraft = () => {
    try {
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        const data = JSON.parse(savedDraft);
        if (data.itemName != null) setItemName(data.itemName);
        if (data.currentIcon != null) setCurrentIcon(data.currentIcon);
        if (data.storyDescription != null) setStoryDescription(data.storyDescription);
        if (data.didacticDescription != null) setDidacticDescription(data.didacticDescription);
        if (data.cost != null) setCost(data.cost);
        if (data.minPrice != null) setMinPrice(data.minPrice);
        if (data.minPriceEnabled != null) setMinPriceEnabled(data.minPriceEnabled);
        if (data.badgeDiscounts != null) setBadgeDiscounts(data.badgeDiscounts);
        if (data.isVisible != null) setIsVisible(data.isVisible);
        if (data.restrictRankEnabled != null) setRestrictRankEnabled(data.restrictRankEnabled);
        if (data.unlockRankId != null) setUnlockRankId(data.unlockRankId);
        if (data.groupLimitEnabled != null) setGroupLimitEnabled(data.groupLimitEnabled);
        if (data.groupLimit != null) setGroupLimit(data.groupLimit);
        if (data.studentLimitEnabled != null) setStudentLimitEnabled(data.studentLimitEnabled);
        if (data.studentLimit != null) setStudentLimit(data.studentLimit);
        if (data.currentStep != null) setCurrentStep(Math.min(TOTAL_STEPS, Math.max(1, data.currentStep)));

        if (Array.isArray(data.checkedCategoryIds)) {
          const checkedSet = new Set(data.checkedCategoryIds.map(String));
          setCategories((current) => current.map((c) => ({
            ...c,
            checked: checkedSet.has(String(c.id)) ? 1 : 0,
          })));
        }
        localStorage.removeItem(draftKey);
        showSuccess('Wczytano wersję roboczą.');
      }
    } catch {
      showError('Nie udało się wczytać wersji roboczej.');
    } finally {
      setIsDraftPromptOpen(false);
    }
  };

  const handleDiscardDraftAndNew = () => {
    try {
      localStorage.removeItem(draftKey);
    } catch {
      // ignore
    }
    setIsDraftPromptOpen(false);
  };

  const handleSaveDraftAndExit = () => {
    try {
      const checkedCategoryIds = categories.filter((c) => c.checked === 1).map((c) => c.id);
      const draftData = {
        currentStep,
        itemName,
        currentIcon,
        storyDescription,
        didacticDescription,
        checkedCategoryIds,
        cost,
        minPrice,
        minPriceEnabled,
        badgeDiscounts,
        isVisible,
        restrictRankEnabled,
        unlockRankId,
        groupLimitEnabled,
        groupLimit,
        studentLimitEnabled,
        studentLimit,
        timestamp: Date.now(),
      };
      localStorage.setItem(draftKey, JSON.stringify(draftData));
      showSuccess('Wersja robocza została zapisana.');
    } catch {
      showError('Nie udało się zapisać wersji roboczej.');
    }
    setIsUnsavedModalOpen(false);
    if (onClose) {
      onClose();
    } else {
      window.location.href = `/groups/${groupId}/shop`;
    }
  };

  const handleDiscardAndExit = () => {
    try {
      localStorage.removeItem(draftKey);
    } catch {
      // ignore
    }
    setIsUnsavedModalOpen(false);
    if (onClose) {
      onClose();
    } else {
      window.location.href = `/groups/${groupId}/shop`;
    }
  };

  // Sprawdzanie czy formularz ma wprowadzone dane
  const hasUserChanges = Boolean(
    itemName.trim() ||
    cost.trim() ||
    storyDescription.trim() ||
    didacticDescription.trim() ||
    badgeDiscounts.length > 0 ||
    currentStep > 1
  );

  const handleAttemptClose = useCallback(() => {
    if (hasUserChanges) {
      setIsUnsavedModalOpen(true);
    } else if (onClose) {
      onClose();
    } else {
      window.location.href = `/groups/${groupId}/shop`;
    }
  }, [hasUserChanges, onClose, groupId]);

  useImperativeHandle(ref, () => ({
    handleAttemptClose,
  }), [handleAttemptClose]);

  // --- Walidacja i nawigacja kroków ---
  const validateStep = (step) => {
    let isValid = true;
    setNameError('');
    setCostError('');
    setGroupLimitError('');
    setStudentLimitError('');

    if (step === 1) {
      if (!itemName.trim()) {
        setNameError('Podaj nazwę przedmiotu.');
        showError('Podaj nazwę przedmiotu.');
        isValid = false;
      }
    } else if (step === 2) {
      if (!cost || Number(cost) < 0) {
        setCostError('Wpisz poprawną cenę bazową.');
        showError('Wpisz poprawną cenę bazową.');
        isValid = false;
      }
    } else if (step === 3) {
      if (groupLimitEnabled && (!groupLimit || Number(groupLimit) <= 0)) {
        setGroupLimitError('Wpisz limit sztuk na grupę.');
        showError('Wpisz limit sztuk na grupę.');
        isValid = false;
      }
      if (studentLimitEnabled && (!studentLimit || Number(studentLimit) <= 0)) {
        setStudentLimitError('Wpisz limit sztuk na studenta.');
        showError('Wpisz limit sztuk na studenta.');
        isValid = false;
      }
    }

    return isValid;
  };

  const handleNextStep = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  };

  // --- Zapis finalny (Krok 4) ---
  const handleFinalSave = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: itemName.trim(),
        basePrice: Number(cost),
      };

      if (editingItemId) {
        payload.isPublished = isVisible;
      }

      if (!isEditingExtraLife) {
        payload.imageRef = `${currentIcon}*${iconBackground}`;
      }

      if (storyDescription.trim()) {
        payload.storyDescription = storyDescription.trim();
      }

      if (didacticDescription.trim()) {
        payload.educationalDescription = didacticDescription.trim();
      }

      const categoryIds = categories.filter((c) => c.checked === 1).map((c) => c.id);
      if (categoryIds.length > 0) {
        payload.categoryIds = categoryIds;
      } else if (editingItemId) {
        payload.categoryId = null;
      }

      if (groupLimitEnabled) {
        payload.stockQuantity = Number(groupLimit);
      } else if (editingItemId) {
        payload.stockQuantity = null;
      }

      if (studentLimitEnabled) {
        payload.perStudentLimit = Number(studentLimit);
      } else if (editingItemId) {
        payload.perStudentLimit = null;
      }

      const badgePromotions = badgeDiscounts.map((d) => {
        const isPercent = String(d.value).endsWith('%');
        return {
          id: d.badgeid,
          promotionType: isPercent ? 'percent' : 'fixed',
          value: Number(String(d.value).replace('%', '')),
        };
      });

      payload.badgePromotions = badgePromotions;
      payload.rankPromotions = [];

      const saveResult = editingItemId
        ? await updateGroupShopItem(groupId, editingItemId, payload)
        : await createGroupShopItem(groupId, payload);

      if (!saveResult.ok) {
        showError(saveResult.error ?? 'Nie udało się zapisać przedmiotu.');
        setIsSubmitting(false);
        return;
      }

      const savedItemId = editingItemId ?? saveResult.item?.id ?? null;
      if (savedItemId) {
        // Jeśli nowo utworzony przedmiot ma być opublikowany (isVisible: true), aktualizujemy isPublished
        if (!editingItemId && isVisible === true) {
          await updateGroupShopItem(groupId, savedItemId, { isPublished: true });
        }

        const rankRefs = ranks.map((r) => ({
          dbId: r.id,
          name: r.name,
          shopItems: r.uniqueStoreItems || [],
        }));
        await syncShopItemRankUnlock(
          groupId,
          String(savedItemId),
          restrictRankEnabled && unlockRankId !== '' ? Number(unlockRankId) : null,
          rankRefs,
        );
      }

      // Czyszczenie wersji roboczej
      try {
        localStorage.removeItem(draftKey);
      } catch {
        // ignore
      }

      showSuccess(editingItemId ? 'Przedmiot został zaktualizowany!' : 'Przedmiot został dodany do sklepu!');
      if (onSaved) {
        onSaved();
      } else if (onClose) {
        onClose();
      } else {
        window.location.href = `/groups/${groupId}/shop`;
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Błąd zapisu przedmiotu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="shop-item-form shop-item-wizard">
      {/* Nagłówek wizarda (ukrywany w modalu, gdyż jest renderowany w tytule modala) */}
      {!hideInternalHeader && (
        <ShopItemWizardHeader
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          isEditing={Boolean(editingItemId)}
        />
      )}

      {/* Ciało aktualnego kroku */}
      <div className="shop-item-wizard__content">
        {currentStep === 1 && (
          <ShopItemStepInfo
            itemName={itemName}
            setItemName={setItemName}
            storyDescription={storyDescription}
            setStoryDescription={setStoryDescription}
            didacticDescription={didacticDescription}
            setDidacticDescription={setDidacticDescription}
            currentIcon={currentIcon}
            setCurrentIcon={setCurrentIcon}
            isEditingExtraLife={isEditingExtraLife}
            categories={categories}
            onCategoryCheckChange={handleCategoryCheckChange}
            onCreateCategory={handleCreateCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
            nameError={nameError}
          />
        )}

        {currentStep === 2 && (
          <ShopItemStepPricing
            cost={cost}
            setCost={setCost}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            minPriceEnabled={minPriceEnabled}
            setMinPriceEnabled={setMinPriceEnabled}
            badges={badges}
            badgeDiscounts={badgeDiscounts}
            setBadgeDiscounts={setBadgeDiscounts}
            ranks={ranks}
            setRanks={setRanks}
            costError={costError}
          />
        )}

        {currentStep === 3 && (
          <ShopItemStepAvailability
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            restrictRankEnabled={restrictRankEnabled}
            setRestrictRankEnabled={setRestrictRankEnabled}
            unlockRankId={unlockRankId}
            setUnlockRankId={setUnlockRankId}
            ranks={ranks}
            groupLimitEnabled={groupLimitEnabled}
            setGroupLimitEnabled={setGroupLimitEnabled}
            groupLimit={groupLimit}
            setGroupLimit={setGroupLimit}
            studentLimitEnabled={studentLimitEnabled}
            setStudentLimitEnabled={setStudentLimitEnabled}
            studentLimit={studentLimit}
            setStudentLimit={setStudentLimit}
            groupLimitError={groupLimitError}
            studentLimitError={studentLimitError}
          />
        )}

        {currentStep === 4 && (
          <ShopItemStepSummary
            itemName={itemName}
            currentIcon={currentIcon}
            storyDescription={storyDescription}
            didacticDescription={didacticDescription}
            categories={categories}
            cost={cost}
            minPriceEnabled={minPriceEnabled}
            minPrice={minPrice}
            badgeDiscounts={badgeDiscounts}
            ranks={ranks}
            isVisible={isVisible}
            restrictRankEnabled={restrictRankEnabled}
            unlockRankId={unlockRankId}
            groupLimitEnabled={groupLimitEnabled}
            groupLimit={groupLimit}
            studentLimitEnabled={studentLimitEnabled}
            studentLimit={studentLimit}
            isEditing={Boolean(editingItemId)}
            onJumpToStep={setCurrentStep}
          />
        )}
      </div>

      {/* Pasek nawigacji / stopka wizarda — przyciski po prawej stronie */}
      <div className="shop-item-wizard__footer">
        <div className="shop-item-wizard__footer-actions">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={editingItemId && currentStep !== 4 ? () => setCurrentStep(4) : handlePrevStep}
              disabled={isSubmitting}
            >
              {editingItemId && currentStep !== 4 ? 'Wróć do podsumowania' : 'Cofnij'}
            </Button>
          )}

          {currentStep < TOTAL_STEPS && !editingItemId ? (
            <Button type="button" variant="primary" size="md" onClick={handleNextStep}>
              Dalej
            </Button>
          ) : editingItemId && currentStep !== 4 ? (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => {
                if (validateStep(currentStep)) {
                  setCurrentStep(4);
                }
              }}
              disabled={isSubmitting}
            >
              Dalej
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleFinalSave}
              disabled={isSubmitting}
            >
              {editingItemId ? 'Zapisz zmiany' : 'Dodaj do sklepu'}
            </Button>
          )}
        </div>
      </div>

      {/* Modal zapytania przy wyjściu (Anuluj / Odrzuć / Zapisz roboczo) */}
      <ShopItemUnsavedModal
        isOpen={isUnsavedModalOpen}
        onClose={() => setIsUnsavedModalOpen(false)}
        onDiscard={handleDiscardAndExit}
        onSaveDraft={handleSaveDraftAndExit}
      />

      {/* Modal zapytania przy starcie (Wczytaj wersję roboczą vs Nowy) */}
      <ShopItemDraftPromptModal
        isOpen={isDraftPromptOpen}
        onClose={handleDiscardDraftAndNew}
        onLoadDraft={handleLoadDraft}
        onDiscardDraftAndNew={handleDiscardDraftAndNew}
      />
    </div>
  );
});

export default ShopItemFormContent;
