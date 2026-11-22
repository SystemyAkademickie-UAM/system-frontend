/**
 * @file DevToolsPage.jsx
 * @description Kompleksowy widok narzędzi deweloperskich skompresowanych do 1-kliknięcia, podzielony na 4 segmenty ról.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import AppSectionPage from '../../components/page/AppSectionPage.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import Divider from '../../components/ui/Divider/Divider.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner.jsx';
import { useToast } from '../../components/ui/Toast/Toast.jsx';
import { useSession } from '../../context/SessionContext.jsx';
import { getApiBaseUrl } from '../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../../auth/browserIdStorage.js';
import { generateMinimalPdf } from './generateMinimalPdf.js';
import barMlecznyPreset from './barMlecznyPreset.json';

// Importy API aplikacji
import { listOrganizations } from '../../services/organizations.api.js';
import {
  listManageableOrganizations,
  listOrganizationAccounts,
  importOrganizationAccounts,
} from '../../services/organizationAdmin.api.js';
import {
  fetchUserGroups,
  createGroup,
  deleteGroup,
} from '../../services/groups.api.js';
import {
  fetchGroupStudents,
  bulkUpdateStudents,
} from '../../services/students.api.js';
import {
  createBadge,
  fetchGroupBadges,
} from '../../services/badges.api.js';
import {
  createRank,
  fetchGroupRanks,
} from '../../services/ranks.api.js';
import {
  createGroupItemCategory,
  fetchGroupItemCategories,
} from '../../services/itemCategories.api.js';
import {
  createGroupShopItem,
  fetchGroupShopItems,
} from '../../services/shop.api.js';
import { postJson } from '../../services/api-client.js';

import './DevToolsPage.css';

export default function DevToolsPage() {
  const { user } = useSession();
  const { showSuccess, showError } = useToast();

  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  // Dostępne dane w systemie
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudentAccountId, setSelectedStudentAccountId] = useState('');

  // Waluta do modyfikacji
  const [currencyAmount, setCurrencyAmount] = useState(1000);

  const addLog = useCallback((msg, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [{ id: Math.random(), msg: `[${timestamp}] ${msg}`, type }, ...prev]);
  }, []);

  // Załadowanie organizacji i grup użytkownika
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      // Organizacje
      try {
        const orgs = await listManageableOrganizations();
        const validOrgs = Array.isArray(orgs) ? orgs : (orgs?.items || []);
        setOrganizations(validOrgs);
        if (validOrgs.length > 0) {
          setSelectedOrgId(String(validOrgs[0].id));
        }
      } catch {
        // Fallback dla superadmina
        const allOrgs = await listOrganizations();
        setOrganizations(allOrgs);
        if (allOrgs.length > 0) {
          setSelectedOrgId(String(allOrgs[0].id));
        }
      }

      // Grupy
      const userGroups = await fetchUserGroups();
      setGroups(userGroups);
      if (userGroups.length > 0) {
        setSelectedGroupId(userGroups[0].id);
      }
    } catch (err) {
      addLog(`Błąd wczytywania danych początkowych: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [addLog]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Załadowanie studentów dla wybranej grupy
  useEffect(() => {
    if (!selectedGroupId) {
      setStudents([]);
      setSelectedStudentAccountId('');
      return;
    }
    async function loadStudents() {
      try {
        const list = await fetchGroupStudents(selectedGroupId);
        setStudents(list);
        if (list.length > 0) {
          // Jeśli aktualny user jest studentem w tej grupie, zaznacz go domyślnie
          const currentStudent = list.find((s) => s.accountId === user?.accountId);
          setSelectedStudentAccountId(String(currentStudent?.accountId || list[0].accountId));
        } else {
          setSelectedStudentAccountId('');
        }
      } catch {
        setStudents([]);
      }
    }
    loadStudents();
  }, [selectedGroupId, user?.accountId]);

  // ==========================================
  // 1. SEGMENT: OSOBA NADZORUJĄCA (SUPERADMIN)
  // ==========================================

  // Wgranie wszystkich 3 dokumentów PDF
  const handleUploadAllLegalDocuments = async () => {
    try {
      setLoading(true);
      addLog('Rozpoczynanie generowania i wgrywania dokumentów prawnych...', 'info');
      const base = getApiBaseUrl();
      const browserId = getOrCreateBrowserId();

      const docsToUpload = [
        {
          key: 'termsOfUse',
          title: 'Warunki Uzytkowania (Regulamin)',
          filename: 'warunki-uzytkowania.pdf',
          text: 'Niniejszy regulamin okresla zasady korzystania z platformy MyAcademyQuest.',
        },
        {
          key: 'privacyPolicy',
          title: 'Polityka Prywatnosci',
          filename: 'polityka-prywatnosci.pdf',
          text: 'Zasady przetwarzania danych osobowych oraz bezpieczenstwo informacji uzytkownikow.',
        },
        {
          key: 'documentation',
          title: 'Dokumentacja Techniczna',
          filename: 'dokumentacja.pdf',
          text: 'Dokumentacja architektury systemu, API oraz scenariuszy grywalizacyjnych.',
        },
      ];

      for (const item of docsToUpload) {
        const pdfBlob = generateMinimalPdf(item.title, item.text);
        const formData = new FormData();
        formData.append('file', pdfBlob, item.filename);

        const res = await fetch(`${base}/admin/documents/${item.key}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'X-Browser-ID': browserId },
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`Błąd wgrywania ${item.key}: HTTP ${res.status}`);
        }
        addLog(`Pomyślnie wgrano dokument: ${item.title} (${item.filename})`, 'success');
      }

      showSuccess('Wszystkie 3 dokumenty prawne PDF zostały wgrane!');
    } catch (err) {
      addLog(`Błąd wgrywania dokumentów: ${err.message}`, 'error');
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Dodanie przykładowych wydań patch notes
  const handleSeedPatchNotes = async () => {
    try {
      setLoading(true);
      addLog('Rozpoczynanie publikacji przykładowych wydań (Patch notes)...', 'info');
      const base = getApiBaseUrl();
      const browserId = getOrCreateBrowserId();

      const releases = [
        { version: '1.4.0', title: 'Wydanie 1.4.0 - Moduł Grywalizacji i Zarządzania Rzeczami' },
        { version: '1.3.2', title: 'Wydanie 1.3.2 - Poprawki uwierzytelniania SAML i Magic Links' },
        { version: '1.2.0', title: 'Wydanie 1.2.0 - Wprowadzenie Centrum Komunikatów i Zgłoszeń' },
      ];

      for (const rel of releases) {
        const pdfBlob = generateMinimalPdf(rel.title, `Szczegółowa lista zmian dla wydania ${rel.version}.`);
        const formData = new FormData();
        formData.append('file', pdfBlob, `patch-notes-${rel.version}.pdf`);
        formData.append('title', rel.title);
        formData.append('version', rel.version);

        const res = await fetch(`${base}/admin/patch-notes`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'X-Browser-ID': browserId },
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`Błąd tworzenia patch note ${rel.version}`);
        }
        addLog(`Opublikowano wydanie: ${rel.title}`, 'success');
      }

      showSuccess('Przykładowe wydania (Patch notes) zostały utworzone!');
    } catch (err) {
      addLog(`Błąd tworzenia wydań: ${err.message}`, 'error');
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Masowe usunięcie wszystkich grup
  const handleDeleteAllGroups = async () => {
    if (!window.confirm('Czy na pewno chcesz usunąć WSZYSTKIE dostępne grupy?')) return;
    try {
      setLoading(true);
      addLog('Rozpoczynanie masowego usuwania grup...', 'info');
      const allGroups = await fetchUserGroups();
      let count = 0;
      for (const g of allGroups) {
        await deleteGroup(g.id);
        addLog(`Usunięto grupę: ${g.storyName} (ID: ${g.id})`, 'success');
        count++;
      }
      await loadInitialData();
      showSuccess(`Usunięto łącznie ${count} grup.`);
    } catch (err) {
      addLog(`Błąd podczas usuwania grup: ${err.message}`, 'error');
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 2. SEGMENT: OSOBA ADMINISTRUJĄCA (ORGANIZACJA)
  // ==========================================

  // Masowe utworzenie przykładowych studentów i prowadzących
  const handleSeedOrganizationAccounts = async () => {
    if (!selectedOrgId) {
      showError('Wybierz organizację docelową.');
      return;
    }
    try {
      setLoading(true);
      addLog(`Tworzenie przykładowych kont dla organizacji ID ${selectedOrgId}...`, 'info');

      const sampleUsers = [
        { email: `student.test1+${Date.now()}@localhost.invalid`, name: 'Piotr', surname: 'Nowak', role: 'student' },
        { email: `student.test2+${Date.now()}@localhost.invalid`, name: 'Anna', surname: 'Kowalska', role: 'student' },
        { email: `student.test3+${Date.now()}@localhost.invalid`, name: 'Michał', surname: 'Wiśniewski', role: 'student' },
        { email: `student.test4+${Date.now()}@localhost.invalid`, name: 'Katarzyna', surname: 'Wójcik', role: 'student' },
        { email: `wykladowca.test+${Date.now()}@localhost.invalid`, name: 'dr Jan', surname: 'Kowalski', role: 'lecturer' },
      ];

      const res = await importOrganizationAccounts(Number(selectedOrgId), sampleUsers);
      addLog(`Pomyślnie zaimportowano ${res?.created ?? sampleUsers.length} kont do organizacji!`, 'success');
      showSuccess(`Utworzono ${res?.created ?? sampleUsers.length} nowych kont w organizacji.`);
    } catch (err) {
      addLog(`Błąd tworzenia kont: ${err.message}`, 'error');
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 3. SEGMENT: OSOBA PROWADZĄCA (LECTURER)
  // ==========================================

  // Masowe utworzenie grupy z pełnym kontentem z pliku bmnkg.txt
  const handleCreateBarMlecznyGroup = async () => {
    try {
      setLoading(true);
      addLog('Rozpoczynanie generowania pełnej grupy: Bar mleczny na krańcu galaktyki...', 'info');

      // 1. Utworzenie grupy
      const groupData = {
        name: barMlecznyPreset.groupName,
        subjectName: barMlecznyPreset.subject,
        description: barMlecznyPreset.description,
        isArchived: false,
      };

      const createdGroupRes = await createGroup(groupData);
      const newGroupId = createdGroupRes?.id || createdGroupRes?.group?.id;
      if (!newGroupId) {
        throw new Error('Nie udało się utworzyć nowej grupy na backendzie');
      }
      addLog(`Krok 1/6: Utworzono grupę "${barMlecznyPreset.groupName}" (ID: ${newGroupId})`, 'success');

      // 2. Kategorie sklepu
      addLog('Krok 2/6: Konfiguracja kategorii sklepowych...', 'info');
      const catMap = new Map();
      for (const cat of barMlecznyPreset.categories) {
        try {
          const res = await createGroupItemCategory(newGroupId, {
            name: cat.name,
            color: cat.color,
          });
          const catId = res?.id || res?.category?.id;
          if (catId) catMap.set(cat.name, catId);
        } catch (e) {
          console.warn('Cat error:', e);
        }
      }
      addLog(`Utworzono ${catMap.size} kategorii sklepu.`, 'success');

      // 3. Przedmioty sklepu
      addLog('Krok 3/6: Tworzenie przedmiotów w sklepie...', 'info');
      let itemsCreated = 0;
      for (const item of barMlecznyPreset.items) {
        const catId = catMap.get(item.categoryName) || null;
        try {
          await createGroupShopItem(newGroupId, {
            name: item.name,
            description: item.description,
            price: item.price,
            categoryId: catId,
          });
          itemsCreated++;
        } catch (e) {
          console.warn('Item error:', e);
        }
      }
      addLog(`Utworzono ${itemsCreated} przedmiotów w sklepie.`, 'success');

      // 4. Odznaki
      addLog('Krok 4/6: Konfiguracja odznak grupy...', 'info');
      let badgesCreated = 0;
      const rarityMap = { 0: 'common', 1: 'uncommon', 2: 'rare', 3: 'epic' };
      for (const badge of barMlecznyPreset.badges) {
        try {
          await createBadge(newGroupId, {
            name: badge.name,
            rarity: rarityMap[badge.rarity] || 'common',
            rewardAmount: badge.rewardAmount,
            storyDescription: badge.storyDescription,
            educationalDescription: badge.educationalDescription,
          });
          badgesCreated++;
        } catch (e) {
          console.warn('Badge error:', e);
        }
      }
      addLog(`Utworzono ${badgesCreated} odznak.`, 'success');

      // 5. Ścieżka rang
      addLog('Krok 5/6: Konfiguracja rang grupy...', 'info');
      let ranksCreated = 0;
      for (const rank of barMlecznyPreset.ranks) {
        try {
          await createRank(newGroupId, {
            name: rank.name,
            requiredPoints: rank.requiredPoints,
            storyDescription: rank.description,
          });
          ranksCreated++;
        } catch (e) {
          console.warn('Rank error:', e);
        }
      }
      addLog(`Utworzono ${ranksCreated} rang.`, 'success');

      // 6. Etapy i Aktywności
      addLog('Krok 6/6: Tworzenie etapów i aktywności fabularnych...', 'info');
      let stagesCreated = 0;
      let activitiesCreated = 0;

      for (const stage of barMlecznyPreset.stages) {
        try {
          // POST /stages
          const stageRes = await postJson('/stages', {
            method: 'post',
            groupId: Number(newGroupId),
            name: stage.title,
          });
          const stageId = stageRes?.data?.stageId || stageRes?.data?.id;

          if (stageId) {
            stagesCreated++;
            for (const act of stage.activities) {
              try {
                // POST /activities
                await postJson('/activities', {
                  method: 'post',
                  stageId: Number(stageId),
                  name: act.name,
                  currency: act.currency,
                  educationalDescription: act.educationalDescription,
                  storyDescription: act.storyDescription,
                });
                activitiesCreated++;
              } catch (e) {
                console.warn('Act error:', e);
              }
            }
          }
        } catch (e) {
          console.warn('Stage error:', e);
        }
      }
      addLog(`Utworzono ${stagesCreated} etapów oraz ${activitiesCreated} aktywności!`, 'success');

      await loadInitialData();
      showSuccess(`Pomyślnie wygenerowano kompletną grupę "${barMlecznyPreset.groupName}"!`);
    } catch (err) {
      addLog(`Błąd tworzenia grupy: ${err.message}`, 'error');
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Masowe dodanie waluty wszystkim studentom w wybranej grupie
  const handleGrantCurrencyToAllStudents = async () => {
    if (!selectedGroupId) {
      showError('Wybierz grupę.');
      return;
    }
    if (students.length === 0) {
      showError('W wybranej grupie nie ma jeszcze żadnych studentów.');
      return;
    }
    try {
      setLoading(true);
      addLog(`Dodawanie +${currencyAmount} monet wszystkim studentom (${students.length}) w grupie ID ${selectedGroupId}...`, 'info');

      const updates = students.map((s) => ({
        enrollmentId: s.enrollmentId,
        currency: (s.currency || 0) + Number(currencyAmount),
        totalEarned: (s.totalEarned || 0) + Number(currencyAmount),
      }));

      const res = await bulkUpdateStudents(selectedGroupId, updates);
      if (!res.ok) throw new Error(res.error || 'Błąd aktualizacji');

      addLog(`Pomyślnie zaktualizowano stan kont ${res.updated || updates.length} studentów!`, 'success');
      showSuccess(`Dodano po +${currencyAmount} waluty dla wszystkich studentów.`);
      // Odśwież listę studentów
      const updatedList = await fetchGroupStudents(selectedGroupId);
      setStudents(updatedList);
    } catch (err) {
      addLog(`Błąd modyfikacji waluty: ${err.message}`, 'error');
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 4. SEGMENT: OSOBA STUDIUJĄCA (STUDENT)
  // ==========================================

  // Dynamiczne zwiększenie waluty wybranemu lub zalogowanemu studentowi
  const handleGrantCurrencyToSingleStudent = async () => {
    if (!selectedGroupId) {
      showError('Wybierz grupę.');
      return;
    }
    if (!selectedStudentAccountId) {
      showError('Wybierz studenta.');
      return;
    }
    const targetStudent = students.find((s) => String(s.accountId) === String(selectedStudentAccountId));
    if (!targetStudent) {
      showError('Nie znaleziono studenta w wybranej grupie.');
      return;
    }

    try {
      setLoading(true);
      addLog(`Zwiększanie waluty o +${currencyAmount} dla studenta: ${targetStudent.name} ${targetStudent.surname}...`, 'info');

      const res = await bulkUpdateStudents(selectedGroupId, [
        {
          enrollmentId: targetStudent.enrollmentId,
          currency: (targetStudent.currency || 0) + Number(currencyAmount),
          totalEarned: (targetStudent.totalEarned || 0) + Number(currencyAmount),
        },
      ]);
      if (!res.ok) throw new Error(res.error || 'Błąd aktualizacji');

      addLog(`Pomyślnie zaktualizowano walutę studenta ${targetStudent.name}!`, 'success');
      showSuccess(`Waluta studenta ${targetStudent.name} ${targetStudent.surname} została zwiększona o ${currencyAmount}.`);
      // Odśwież listę studentów
      const updatedList = await fetchGroupStudents(selectedGroupId);
      setStudents(updatedList);
    } catch (err) {
      addLog(`Błąd zwiększania waluty: ${err.message}`, 'error');
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Odblokowanie / przyznanie odznak studentowi
  const handleAwardBadgesToStudent = async () => {
    if (!selectedGroupId || !selectedStudentAccountId) {
      showError('Wybierz grupę oraz studenta.');
      return;
    }
    try {
      setLoading(true);
      addLog(`Wczytywanie dostępnych odznak w grupie ${selectedGroupId}...`, 'info');
      const badges = await fetchGroupBadges(selectedGroupId);
      if (!badges || badges.length === 0) {
        showError('Brak odznak zdefiniowanych w tej grupie.');
        return;
      }

      // Przyznaj odznaki poprzez endpoint POST /groups/:groupId/students/:accountId/badges/:badgeId/toggle
      let awarded = 0;
      for (const b of badges.slice(0, 5)) {
        try {
          await postJson(`/groups/${selectedGroupId}/students/${selectedStudentAccountId}/badges/${b.id}/toggle`, {});
          awarded++;
        } catch (e) {
          console.warn('Award badge error:', e);
        }
      }
      addLog(`Przyznano ${awarded} odznak studentowi!`, 'success');
      showSuccess(`Przyznano ${awarded} odznak studentowi.`);
      const updatedList = await fetchGroupStudents(selectedGroupId);
      setStudents(updatedList);
    } catch (err) {
      addLog(`Błąd przyznawania odznak: ${err.message}`, 'error');
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Zakup losowego przedmiotu ze sklepu dla studenta
  const handleBuyShopItemForStudent = async () => {
    if (!selectedGroupId) {
      showError('Wybierz grupę.');
      return;
    }
    try {
      setLoading(true);
      addLog(`Wczytywanie przedmiotów sklepu w grupie ${selectedGroupId}...`, 'info');
      const items = await fetchGroupShopItems(selectedGroupId);
      if (!items || items.length === 0) {
        showError('Brak przedmiotów w sklepie grupy.');
        return;
      }
      const itemToBuy = items[0];
      addLog(`Zakup przedmiotu: ${itemToBuy.name} dla zalogowanego studenta...`, 'info');

      // POST /groups/:groupId/shop-items/:itemId/buy
      const res = await postJson(`/groups/${selectedGroupId}/shop-items/${itemToBuy.id}/buy`, {});
      if (!res.ok) {
        throw new Error(res.data?.message || 'Nie udało się kupić przedmiotu (być może brak wystarczającej waluty)');
      }
      addLog(`Pomyślnie zakupiono przedmiot: ${itemToBuy.name}!`, 'success');
      showSuccess(`Zakupiono przedmiot: ${itemToBuy.name}`);
    } catch (err) {
      addLog(`Błąd zakupu przedmiotu: ${err.message}`, 'error');
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppSectionPage title="Narzędzia Deweloperskie (Dev Tools)">
      <div className="dev-tools-page">
        {/* Pasek kontekstu wyboru */}
        <div className="dev-tools-context-card">
          <div className="dev-tools-context-card__info">
            <div className="dev-tools-context-item">
              <span className="dev-tools-context-item__label">Organizacja:</span>
              <select
                value={selectedOrgId}
                onChange={(e) => setSelectedOrgId(e.target.value)}
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} (ID: {org.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="dev-tools-context-item">
              <span className="dev-tools-context-item__label">Grupa aktywna:</span>
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
              >
                {groups.length === 0 ? <option value="">Brak dostępnych grup</option> : null}
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.storyName} (ID: {g.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="dev-tools-context-item">
              <span className="dev-tools-context-item__label">Student (cel akcji):</span>
              <select
                value={selectedStudentAccountId}
                onChange={(e) => setSelectedStudentAccountId(e.target.value)}
              >
                {students.length === 0 ? <option value="">Brak studentów w grupie</option> : null}
                {students.map((s) => {
                  const isCurrent = s.accountId === user?.accountId;
                  return (
                    <option key={s.accountId} value={s.accountId}>
                      {s.name} {s.surname} {isCurrent ? '(Ty)' : ''} [Saldo: {s.currency}]
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="dev-tools-context-item">
              <span className="dev-tools-context-item__label">Kwota waluty:</span>
              <input
                type="number"
                value={currencyAmount}
                onChange={(e) => setCurrencyAmount(Number(e.target.value))}
                style={{ width: '90px' }}
              />
            </div>
          </div>

          <Button variant="secondary" size="sm" onClick={loadInitialData} disabled={loading}>
            Odśwież kontekst
          </Button>
        </div>

        {/* 4 Segmenty ról */}
        <div className="dev-tools-sections">
          {/* SEGMENT 1: OSOBA NADZORUJĄCA */}
          <section className="dev-role-section">
            <div className="dev-role-section__header">
              <div className="dev-role-section__title-group">
                <h3 className="dev-role-section__title">1. Osoba Nadzorująca (Superadmin)</h3>
                <span className="dev-role-section__badge dev-role-section__badge--super">Globalne</span>
              </div>
              <p className="dev-role-section__desc">Narzędzia poziomu całej platformy oraz dokumentacji</p>
            </div>

            <div className="dev-role-section__grid">
              <div className="dev-tool-card">
                <div className="dev-tool-card__info">
                  <span className="dev-tool-card__name">Wgraj wszystkie dokumenty PDF</span>
                  <span className="dev-tool-card__details">
                    Generuje w locie i wgrywa 3 oficjalne pliki PDF (Regulamin, Polityka prywatności, Dokumentacja techniczna) do API.
                  </span>
                </div>
                <div className="dev-tool-card__actions">
                  <Button variant="primary" size="sm" onClick={handleUploadAllLegalDocuments} disabled={loading}>
                    Wgraj 3 PDFy
                  </Button>
                </div>
              </div>

              <div className="dev-tool-card">
                <div className="dev-tool-card__info">
                  <span className="dev-tool-card__name">Wygeneruj historię zmian (Patch notes)</span>
                  <span className="dev-tool-card__details">
                    Publikuje zestaw wydań (np. 1.4.0, 1.3.2, 1.2.0) wraz z generowanymi plikami PDF changelogów.
                  </span>
                </div>
                <div className="dev-tool-card__actions">
                  <Button variant="secondary" size="sm" onClick={handleSeedPatchNotes} disabled={loading}>
                    Opublikuj wydania
                  </Button>
                </div>
              </div>

              <div className="dev-tool-card">
                <div className="dev-tool-card__info">
                  <span className="dev-tool-card__name">Masowe usuwanie wszystkich grup</span>
                  <span className="dev-tool-card__details">
                    Czyści wszystkie grupy z bazy danych w jednym procesie (przydatne do resetu środowiska testowego).
                  </span>
                </div>
                <div className="dev-tool-card__actions">
                  <Button variant="danger" size="sm" onClick={handleDeleteAllGroups} disabled={loading}>
                    Usuń wszystkie grupy
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* SEGMENT 2: OSOBA ADMINISTRUJĄCA */}
          <section className="dev-role-section">
            <div className="dev-role-section__header">
              <div className="dev-role-section__title-group">
                <h3 className="dev-role-section__title">2. Osoba Administrująca (Organizacja)</h3>
                <span className="dev-role-section__badge dev-role-section__badge--admin">Organizacja</span>
              </div>
              <p className="dev-role-section__desc">Zarządzanie kontami użytkowników wybranej organizacji</p>
            </div>

            <div className="dev-role-section__grid">
              <div className="dev-tool-card">
                <div className="dev-tool-card__info">
                  <span className="dev-tool-card__name">Masowe tworzenie kont (5 osób)</span>
                  <span className="dev-tool-card__details">
                    Tworzy zestaw 4 studentów oraz 1 prowadzącego w aktualnie wybranej organizacji (ID: {selectedOrgId || '-'}).
                  </span>
                </div>
                <div className="dev-tool-card__actions">
                  <Button variant="primary" size="sm" onClick={handleSeedOrganizationAccounts} disabled={loading || !selectedOrgId}>
                    Utwórz 5 kont
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* SEGMENT 3: OSOBA PROWADZĄCA */}
          <section className="dev-role-section">
            <div className="dev-role-section__header">
              <div className="dev-role-section__title-group">
                <h3 className="dev-role-section__title">3. Osoba Prowadząca (Lecturer)</h3>
                <span className="dev-role-section__badge dev-role-section__badge--lecturer">Grupa</span>
              </div>
              <p className="dev-role-section__desc">Tworzenie bogatych scenariuszy i zarządzanie grupami</p>
            </div>

            <div className="dev-role-section__grid">
              <div className="dev-tool-card" style={{ gridColumn: 'span 2' }}>
                <div className="dev-tool-card__info">
                  <span className="dev-tool-card__name">Utwórz grupę "Bar mleczny na krańcu galaktyki" (1-kliknięcie)</span>
                  <span className="dev-tool-card__details">
                    Tworzy kompletną grupę z pliku wzorcowego bmnkg.txt: opis, 21 odznak, 11 rang, 4 kategorie sklepowe, 22 przedmioty, 14 etapów fabularnych i 85 aktywności.
                  </span>
                </div>
                <div className="dev-tool-card__actions">
                  <Button variant="primary" size="sm" onClick={handleCreateBarMlecznyGroup} disabled={loading}>
                    Generuj całą grupę
                  </Button>
                </div>
              </div>

              <div className="dev-tool-card">
                <div className="dev-tool-card__info">
                  <span className="dev-tool-card__name">Dodaj walutę wszystkim studentom w grupie</span>
                  <span className="dev-tool-card__details">
                    Zwiększa saldo każdego studenta w wybranej grupie (ID: {selectedGroupId || '-'}) o kwotę {currencyAmount}.
                  </span>
                </div>
                <div className="dev-tool-card__actions">
                  <Button variant="secondary" size="sm" onClick={handleGrantCurrencyToAllStudents} disabled={loading || !selectedGroupId}>
                    Dodaj +{currencyAmount} wszystkim
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* SEGMENT 4: OSOBA STUDIUJĄCA */}
          <section className="dev-role-section">
            <div className="dev-role-section__header">
              <div className="dev-role-section__title-group">
                <h3 className="dev-role-section__title">4. Osoba Studiująca (Student)</h3>
                <span className="dev-role-section__badge dev-role-section__badge--student">Użytkownik</span>
              </div>
              <p className="dev-role-section__desc">Symulacja postępów, zakupy i waluta konkretnego studenta</p>
            </div>

            <div className="dev-role-section__grid">
              <div className="dev-tool-card">
                <div className="dev-tool-card__info">
                  <span className="dev-tool-card__name">Zwiększ walutę wybranemu studentowi</span>
                  <span className="dev-tool-card__details">
                    Domyślnie dla Ciebie (lub wybranego powyżej studenta). Dodaje +{currencyAmount} do salda i łącznej liczby zarobionych monet.
                  </span>
                </div>
                <div className="dev-tool-card__actions">
                  <Button variant="primary" size="sm" onClick={handleGrantCurrencyToSingleStudent} disabled={loading || !selectedStudentAccountId}>
                    Dodaj +{currencyAmount}
                  </Button>
                </div>
              </div>

              <div className="dev-tool-card">
                <div className="dev-tool-card__info">
                  <span className="dev-tool-card__name">Przyznaj odznaki studentowi</span>
                  <span className="dev-tool-card__details">
                    Odblokowuje zestaw pierwszych 5 odznak dostępnych w wybranej grupie dla wskazanego studenta.
                  </span>
                </div>
                <div className="dev-tool-card__actions">
                  <Button variant="secondary" size="sm" onClick={handleAwardBadgesToStudent} disabled={loading || !selectedStudentAccountId}>
                    Odblokuj odznaki
                  </Button>
                </div>
              </div>

              <div className="dev-tool-card">
                <div className="dev-tool-card__info">
                  <span className="dev-tool-card__name">Kup przedmiot ze sklepu</span>
                  <span className="dev-tool-card__details">
                    Kupuje pierwszy dostępny przedmiot z oferty sklepowej grupy i dodaje go do ekwipunku studenta.
                  </span>
                </div>
                <div className="dev-tool-card__actions">
                  <Button variant="secondary" size="sm" onClick={handleBuyShopItemForStudent} disabled={loading || !selectedGroupId}>
                    Kup przedmiot
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Konsola wyników operacji */}
        {logs.length > 0 ? (
          <div className="dev-tools-console">
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '4px' }}>
              <strong style={{ color: '#ffffff' }}>Dziennik operacji Dev Tools:</strong>
              <button
                type="button"
                onClick={() => setLogs([])}
                style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '0.75rem' }}
              >
                Wyczyść dziennik
              </button>
            </div>
            {logs.map((log) => (
              <div key={log.id} className={`dev-tools-console__entry dev-tools-console__entry--${log.type}`}>
                {log.msg}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </AppSectionPage>
  );
}

