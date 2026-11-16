/**
 * @file FaqContent.jsx
 * @description Główny komponent widoku bazy wiedzy i najczęściej zadawanych pytań (FAQ) z prostym trybem edycji dla osoby nadzorującej.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { useEffect, useState } from 'react';
import AppSectionPage from '../../components/page/AppSectionPage.jsx';
import {
  Button,
  Divider,
  LoadingSpinner,
  TextField,
  useToast,
} from '../../components/ui/index.js';
import {
  DEFAULT_FAQ_CATEGORY,
  FAQ_ANSWER_MAX_LENGTH,
  FAQ_ANSWER_TEXTAREA_ROWS,
  FAQ_CATEGORY_MAX_LENGTH,
  FAQ_QUESTION_MAX_LENGTH,
} from '../../constants/faq.constants.js';
import { useAppRoleOptional } from '../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../navigation/shellTemplates.config.js';
import {
  fetchAdminFaqs,
  fetchPublicFaqs,
  replaceAllFaqs,
} from '../../services/faq.api.js';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';
import './FaqContent.css';

// === STAŁE I ETYKIETY JĘZYKOWE ===
const PAGETITLE__TEXTLABEL = {
  polish: 'Najczęściej zadawane pytania (FAQ)',
  english: 'Frequently Asked Questions (FAQ)',
};

const PAGEDESCRIPTION__TEXTLABEL = {
  polish: 'Baza wiedzy i odpowiedzi na najczęstsze pytania dotyczące korzystania z aplikacji MyAcademyQuest.',
  english: 'Knowledge base and answers to frequently asked questions about using the MyAcademyQuest platform.',
};

const EDIT_BUTTON__TEXTLABEL = {
  polish: 'Edytuj',
  english: 'Edit',
};

const SAVE_BUTTON__TEXTLABEL = {
  polish: 'Zapisz',
  english: 'Save',
};

const SAVING_BUTTON__TEXTLABEL = {
  polish: 'Zapisywanie…',
  english: 'Saving…',
};

const CANCEL_BUTTON__TEXTLABEL = {
  polish: 'Anuluj',
  english: 'Cancel',
};

const ADD_QUESTION_BUTTON__TEXTLABEL = {
  polish: 'Dodaj pytanie',
  english: 'Add question',
};

const DELETE_BUTTON__TEXTLABEL = {
  polish: 'Usuń',
  english: 'Delete',
};

const CATEGORY_FIELD_LABEL__TEXTLABEL = {
  polish: 'Kategoria',
  english: 'Category',
};

const CATEGORY_FIELD_PLACEHOLDER__TEXTLABEL = {
  polish: 'Np. Logowanie i konto',
  english: 'E.g. Login and account',
};

const QUESTION_FIELD_LABEL__TEXTLABEL = {
  polish: 'Pytanie',
  english: 'Question',
};

const QUESTION_FIELD_PLACEHOLDER__TEXTLABEL = {
  polish: 'Wpisz treść pytania…',
  english: 'Enter question text…',
};

const ANSWER_FIELD_LABEL__TEXTLABEL = {
  polish: 'Odpowiedź',
  english: 'Answer',
};

const ANSWER_FIELD_PLACEHOLDER__TEXTLABEL = {
  polish: 'Wpisz treść odpowiedzi…',
  english: 'Enter answer text…',
};

const QUESTION_CARD_HEADER__TEXTLABEL = {
  polish: 'Pytanie #{index}',
  english: 'Question #{index}',
};

const LOADING_FAQ__TEXTLABEL = {
  polish: 'Wczytywanie pytań i odpowiedzi…',
  english: 'Loading questions and answers…',
};

const RETRY_BUTTON__TEXTLABEL = {
  polish: 'Spróbuj ponownie',
  english: 'Try again',
};

const EMPTY_FAQ__TEXTLABEL = {
  polish: 'Brak pytań na stronie FAQ.',
  english: 'No questions on the FAQ page.',
};

const EMPTY_EDITOR__TEXTLABEL = {
  polish: 'Lista pytań jest pusta. Kliknij Dodaj pytanie lub Zapisz.',
  english: 'The question list is empty. Click Add question or Save.',
};

const VALIDATION_QUESTION_REQUIRED__TEXTLABEL = {
  polish: 'Treść pytania jest wymagana.',
  english: 'Question text is required.',
};

const VALIDATION_ANSWER_REQUIRED__TEXTLABEL = {
  polish: 'Treść odpowiedzi jest wymagana.',
  english: 'Answer text is required.',
};

const SAVE_SUCCESS__TEXTLABEL = {
  polish: 'Zapisano zmiany na stronie FAQ.',
  english: 'Changes to the FAQ page have been saved.',
};

const LOAD_ERROR__TEXTLABEL = {
  polish: 'Nie udało się wczytać zawartości strony FAQ.',
  english: 'Failed to load the FAQ page content.',
};

const SAVE_ERROR__TEXTLABEL = {
  polish: 'Nie udało się zapisać zmian na stronie FAQ.',
  english: 'Failed to save changes to the FAQ page.',
};

let nextDraftLocalId = 0;

function createDraftEntry(item, language) {
  nextDraftLocalId += 1;
  return {
    localId: `faq-draft-${nextDraftLocalId}`,
    category: item?.category ?? DEFAULT_FAQ_CATEGORY[language] ?? DEFAULT_FAQ_CATEGORY.polish,
    question: item?.question ?? '',
    answer: item?.answer ?? '',
  };
}

function groupFaqItemsByCategory(faqItems, fallbackCategory) {
  const map = new Map();
  faqItems.forEach((item) => {
    const categoryName = (item.category || '').trim() || fallbackCategory;
    const bucket = map.get(categoryName) ?? [];
    bucket.push(item);
    map.set(categoryName, bucket);
  });
  return Array.from(map.entries()).map(([category, categoryItems]) => ({
    category,
    items: categoryItems,
  }));
}

// === BAZA WIEDZY I FAQ (DOSTĘPNA DLA WSZYSTKICH / ZARZĄDZANIE DLA OSOBY NADZORUJĄCEJ: /faq) ===
/**
 * Rola: Wszyscy użytkownicy (odczyt); Osoba nadzorująca (edycja i zapis).
 * Ścieżka: /faq.
 */
export default function FaqContent() {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const appRole = useAppRoleOptional();
  const { showSuccess, showError } = useToast();

  const isSuperadmin = appRole?.role === APP_ROLE.SUPERADMIN;

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draftItems, setDraftItems] = useState([]);
  const [draftErrors, setDraftErrors] = useState({});

  async function loadFaqs() {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const publicItems = await fetchPublicFaqs();
      setItems(publicItems);
    } catch (error) {
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : LOAD_ERROR__TEXTLABEL[LANGUAGE],
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setErrorMessage('');
    fetchPublicFaqs()
      .then((publicItems) => {
        if (!cancelled) {
          setItems(publicItems);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error && error.message
              ? error.message
              : LOAD_ERROR__TEXTLABEL[LANGUAGE],
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [LANGUAGE]);

  async function handleStartEditing() {
    setErrorMessage('');
    setDraftErrors({});
    try {
      const adminList = await fetchAdminFaqs();
      const sourceItems = Array.isArray(adminList) ? adminList : items;
      const mappedDrafts =
        sourceItems.length > 0
          ? sourceItems.map((item) => createDraftEntry(item, LANGUAGE))
          : [createDraftEntry(null, LANGUAGE)];

      setDraftItems(mappedDrafts);
      setIsEditing(true);
    } catch (error) {
      const msg =
        error instanceof Error && error.message
          ? error.message
          : LOAD_ERROR__TEXTLABEL[LANGUAGE];
      setErrorMessage(msg);
      showError(msg);
    }
  }

  function handleCancelEditing() {
    setIsEditing(false);
    setDraftItems([]);
    setDraftErrors({});
    setErrorMessage('');
  }

  function handleAddDraftItem() {
    setDraftItems((prev) => [...prev, createDraftEntry(null, LANGUAGE)]);
  }

  function handleRemoveDraftItem(localId) {
    setDraftItems((prev) => prev.filter((item) => item.localId !== localId));
    setDraftErrors((prev) => {
      if (!prev[localId]) {
        return prev;
      }
      const next = { ...prev };
      delete next[localId];
      return next;
    });
  }

  function handleDraftFieldChange(localId, field, value) {
    setDraftItems((prev) =>
      prev.map((item) =>
        item.localId === localId ? { ...item, [field]: value } : item,
      ),
    );
    if (field === 'question' || field === 'answer') {
      setDraftErrors((prev) => {
        if (!prev[localId]?.[field]) {
          return prev;
        }
        return {
          ...prev,
          [localId]: {
            ...prev[localId],
            [field]: undefined,
          },
        };
      });
    }
  }

  async function handleSaveAll() {
    const nextErrors = {};
    let hasValidationError = false;

    draftItems.forEach((draft) => {
      const questionError = !draft.question.trim()
        ? VALIDATION_QUESTION_REQUIRED__TEXTLABEL[LANGUAGE]
        : undefined;
      const answerError = !draft.answer.trim()
        ? VALIDATION_ANSWER_REQUIRED__TEXTLABEL[LANGUAGE]
        : undefined;
      if (questionError || answerError) {
        hasValidationError = true;
        nextErrors[draft.localId] = {
          question: questionError,
          answer: answerError,
        };
      }
    });

    if (hasValidationError) {
      setDraftErrors(nextErrors);
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    try {
      const fallbackCategory =
        DEFAULT_FAQ_CATEGORY[LANGUAGE] ?? DEFAULT_FAQ_CATEGORY.polish;
      const payload = draftItems.map((draft, index) => ({
        question: draft.question.trim(),
        answer: draft.answer.trim(),
        category: draft.category.trim() || fallbackCategory,
        orderIndex: index,
        isPublished: true,
      }));

      const savedAll = await replaceAllFaqs(payload);
      setItems(savedAll);
      setIsEditing(false);
      setDraftItems([]);
      setDraftErrors({});
      showSuccess(SAVE_SUCCESS__TEXTLABEL[LANGUAGE]);
    } catch (error) {
      const msg =
        error instanceof Error && error.message
          ? error.message
          : SAVE_ERROR__TEXTLABEL[LANGUAGE];
      setErrorMessage(msg);
      showError(msg);
    } finally {
      setIsSaving(false);
    }
  }

  const fallbackCategory =
    DEFAULT_FAQ_CATEGORY[LANGUAGE] ?? DEFAULT_FAQ_CATEGORY.polish;

  const groupedSections = groupFaqItemsByCategory(items, fallbackCategory);

  const headerAction = isSuperadmin ? (
    isEditing ? (
      <>
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={handleAddDraftItem}
          disabled={isSaving}
        >
          {ADD_QUESTION_BUTTON__TEXTLABEL[LANGUAGE]}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={handleCancelEditing}
          disabled={isSaving}
        >
          {CANCEL_BUTTON__TEXTLABEL[LANGUAGE]}
        </Button>
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={handleSaveAll}
          disabled={isSaving}
        >
          {isSaving
            ? SAVING_BUTTON__TEXTLABEL[LANGUAGE]
            : SAVE_BUTTON__TEXTLABEL[LANGUAGE]}
        </Button>
      </>
    ) : (
      <Button
        type="button"
        variant="primary"
        size="md"
        onClick={handleStartEditing}
        disabled={isLoading}
      >
        {EDIT_BUTTON__TEXTLABEL[LANGUAGE]}
      </Button>
    )
  ) : null;

  // === RENDEROWANIE WIDOKU ===
  return (
    <AppSectionPage
      title={PAGETITLE__TEXTLABEL[LANGUAGE]}
      description={PAGEDESCRIPTION__TEXTLABEL[LANGUAGE]}
      headerAction={headerAction}
      showUnavailableNotice={false}
    >
      <div className="faq-page">
        {errorMessage ? (
          <div className="faq-page__error" role="alert">
            <p className="faq-page__error-text">{errorMessage}</p>
            {!isEditing ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={loadFaqs}
              >
                {RETRY_BUTTON__TEXTLABEL[LANGUAGE]}
              </Button>
            ) : null}
          </div>
        ) : null}

        {isEditing ? (
          <div className="faq-page__editor">
            {draftItems.length === 0 ? (
              <div className="faq-page__empty" role="status">
                <p className="faq-page__empty-text">
                  {EMPTY_EDITOR__TEXTLABEL[LANGUAGE]}
                </p>
              </div>
            ) : (
              draftItems.map((draft, index) => {
                const fieldError = draftErrors[draft.localId] ?? {};
                return (
                  <div key={draft.localId} className="faq-page__edit-card">
                    <div className="faq-page__edit-card-header">
                      <span className="faq-page__edit-card-index">
                        {QUESTION_CARD_HEADER__TEXTLABEL[LANGUAGE].replace(
                          '{index}',
                          String(index + 1),
                        )}
                      </span>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        disabled={isSaving}
                        onClick={() => handleRemoveDraftItem(draft.localId)}
                      >
                        {DELETE_BUTTON__TEXTLABEL[LANGUAGE]}
                      </Button>
                    </div>

                    <div className="faq-page__edit-fields">
                      <TextField
                        id={`${draft.localId}-category`}
                        label={CATEGORY_FIELD_LABEL__TEXTLABEL[LANGUAGE]}
                        placeholder={
                          CATEGORY_FIELD_PLACEHOLDER__TEXTLABEL[LANGUAGE]
                        }
                        value={draft.category}
                        maxLength={FAQ_CATEGORY_MAX_LENGTH}
                        disabled={isSaving}
                        onChange={(event) =>
                          handleDraftFieldChange(
                            draft.localId,
                            'category',
                            event.target.value,
                          )
                        }
                      />

                      <TextField
                        id={`${draft.localId}-question`}
                        label={QUESTION_FIELD_LABEL__TEXTLABEL[LANGUAGE]}
                        placeholder={
                          QUESTION_FIELD_PLACEHOLDER__TEXTLABEL[LANGUAGE]
                        }
                        value={draft.question}
                        maxLength={FAQ_QUESTION_MAX_LENGTH}
                        error={fieldError.question}
                        disabled={isSaving}
                        required
                        onChange={(event) =>
                          handleDraftFieldChange(
                            draft.localId,
                            'question',
                            event.target.value,
                          )
                        }
                      />

                      <TextField
                        id={`${draft.localId}-answer`}
                        label={ANSWER_FIELD_LABEL__TEXTLABEL[LANGUAGE]}
                        placeholder={
                          ANSWER_FIELD_PLACEHOLDER__TEXTLABEL[LANGUAGE]
                        }
                        value={draft.answer}
                        multiline
                        rows={FAQ_ANSWER_TEXTAREA_ROWS}
                        maxLength={FAQ_ANSWER_MAX_LENGTH}
                        error={fieldError.answer}
                        disabled={isSaving}
                        required
                        onChange={(event) =>
                          handleDraftFieldChange(
                            draft.localId,
                            'answer',
                            event.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                );
              })
            )}

            <div className="faq-page__editor-footer">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleAddDraftItem}
                disabled={isSaving}
              >
                {ADD_QUESTION_BUTTON__TEXTLABEL[LANGUAGE]}
              </Button>
              <div className="faq-page__editor-footer-right">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={handleCancelEditing}
                  disabled={isSaving}
                >
                  {CANCEL_BUTTON__TEXTLABEL[LANGUAGE]}
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleSaveAll}
                  disabled={isSaving}
                >
                  {isSaving
                    ? SAVING_BUTTON__TEXTLABEL[LANGUAGE]
                    : SAVE_BUTTON__TEXTLABEL[LANGUAGE]}
                </Button>
              </div>
            </div>
          </div>
        ) : isLoading ? (
          <div className="faq-page__loading" role="status">
            <LoadingSpinner size="md" />
            <p className="faq-page__loading-text">
              {LOADING_FAQ__TEXTLABEL[LANGUAGE]}
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="faq-page__empty" role="status">
            <p className="faq-page__empty-text">
              {EMPTY_FAQ__TEXTLABEL[LANGUAGE]}
            </p>
            {isSuperadmin ? (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleStartEditing}
              >
                {EDIT_BUTTON__TEXTLABEL[LANGUAGE]}
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="faq-page__sections">
            {groupedSections.map((group) => (
              <section
                key={group.category}
                className="faq-page__category-group"
              >
                <h2 className="faq-page__category-title">{group.category}</h2>
                <Divider className="faq-page__category-divider" />
                <ul className="faq-page__items-list">
                  {group.items.map((item) => (
                    <li
                      key={item.id ?? item.question}
                      className="faq-page__item"
                    >
                      <h3 className="faq-page__question">{item.question}</h3>
                      <p className="faq-page__answer">{item.answer}</p>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </AppSectionPage>
  );
}
