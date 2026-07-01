import { useCallback, useEffect, useMemo, useState } from 'react';

import { Modal, SearchBar, useToast } from '../../../../components/ui/index.js';

import {


  fetchActivityCompletions,

  fetchGroupStudents,

  setActivityCompletions,

} from '../../../../services/students.api.js';
import { invalidateStudentProfile } from '../../../../services/studentProfileEvents.js';
import { formatStudentDisplayName } from '../../../../utils/members/studentDisplayName.js';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';



function MemberAssignRow({ member, checked, onToggle }) {
  const displayName = formatStudentDisplayName(member);



  return (

    <div

      className="activity-assign-modal__member-row"

      role="checkbox"

      aria-checked={checked}

      tabIndex={0}

      onClick={onToggle}

      onKeyDown={(event) => {

        if (event.key === 'Enter' || event.key === ' ') {

          event.preventDefault();

          onToggle();

        }

      }}

    >

      <input

        type="checkbox"

        className="activity-assign-modal__checkbox"

        checked={checked}

        readOnly

        tabIndex={-1}

        aria-hidden="true"

      />

      <span className="activity-assign-modal__member-name">{displayName}</span>

    </div>

  );

}



export default function ActivityAssignModal({

  isOpen,

  activity,

  groupId,

  onClose,

}) {

  const { showSuccess, showError } = useToast();
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  const [members, setMembers] = useState([]);

  const [selectedIds, setSelectedIds] = useState(new Set());

  const [searchQuery, setSearchQuery] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [isSaving, setIsSaving] = useState(false);


  const ASSIGNTITLE__TEXTLABEL = {
    polish: 'Przypisz aktywność',
    english: 'Assign Activity',
  };
  const SAVEBUTTON__TEXTLABEL = {
    polish: 'Zapisz',
    english: 'Save',
  };
  const SAVING__TEXTLABEL = {
    polish: 'Zapisywanie...',
    english: 'Saving...',
  };
  const SEARCHPLACEHOLDER__TEXTLABEL = {
    polish: 'Szukaj uczestników…',
    english: 'Search participants…',
  };
  const SEARCHARIALABEL__TEXTLABEL = {
    polish: 'Szukaj uczestników',
    english: 'Search participants',
  };
  const LOADING__TEXTLABEL = {
    polish: 'Ładowanie uczestników...',
    english: 'Loading participants...',
  };
  const NOMEMBERS__TEXTLABEL = {
    polish: 'Brak uczestników w tej grupie.',
    english: 'No participants in this group.',
  };
  const NOSEARCHRESULTS__TEXTLABEL = {
    polish: 'Brak uczestników pasujących do wyszukiwania.',
    english: 'No participants match the search.',
  };
  const LOADERROR__TEXTLABEL = {
    polish: 'Nie udało się załadować uczestników',
    english: 'Failed to load participants',
  };
  const SAVEERROR__TEXTLABEL = {
    polish: 'Nie udało się zapisać przypisania aktywności',
    english: 'Failed to save activity assignment',
  };
  const SAVESUCCESS__TEXTLABEL = {
    polish: 'Przypisanie aktywności zostało zapisane.',
    english: 'Activity assignment saved.',
  };
  const SAVEFAILURE__TEXTLABEL = {
    polish: 'Nie udało się zapisać przypisania',
    english: 'Failed to save assignment',
  };


  useEffect(() => {

    if (!isOpen || !activity || !groupId) {

      return undefined;

    }



    let cancelled = false;



    async function loadMembers() {

      setIsLoading(true);

      setSearchQuery('');



      try {

        const [studentList, completedAccountIds] = await Promise.all([

          fetchGroupStudents(groupId),

          fetchActivityCompletions(groupId, activity.id),

        ]);



        if (cancelled) return;



        const completedIds = new Set(completedAccountIds);

        setSelectedIds(new Set(completedIds));

        setMembers(studentList);

      } catch (error) {

        if (!cancelled) {

          showError(error instanceof Error ? error.message : LOADERROR__TEXTLABEL[LANGUAGE]);

          setMembers([]);

          setSelectedIds(new Set());

        }

      } finally {

        if (!cancelled) {

          setIsLoading(false);

        }

      }

    }



    loadMembers();



    return () => {

      cancelled = true;

    };

  }, [isOpen, activity, groupId, showError, LANGUAGE]);



  const visibleMembers = useMemo(() => {

    const query = searchQuery.trim().toLowerCase();

    if (!query) return members;



    return members.filter((member) => {

      const haystack = [

        member.nickname,

        member.name,

        member.surname,

        member.email,

      ].filter(Boolean).join(' ').toLowerCase();

      return haystack.includes(query);

    });

  }, [members, searchQuery]);



  const toggleMember = useCallback((accountId) => {

    setSelectedIds((prev) => {

      const next = new Set(prev);

      if (next.has(accountId)) {

        next.delete(accountId);

      } else {

        next.add(accountId);

      }

      return next;

    });

  }, []);



  const handleConfirm = async () => {

    if (!activity || !groupId) return;



    setIsSaving(true);



    try {

      const result = await setActivityCompletions(

        groupId,

        activity.id,

        [...selectedIds],

      );



      if (!result.ok) {

        throw new Error(result.error || SAVEERROR__TEXTLABEL[LANGUAGE]);

      }



      showSuccess(SAVESUCCESS__TEXTLABEL[LANGUAGE]);
      invalidateStudentProfile(groupId);
      onClose();

    } catch (error) {

      showError(error instanceof Error && error.message ? error.message : SAVEFAILURE__TEXTLABEL[LANGUAGE]);

    } finally {

      setIsSaving(false);

    }

  };



  if (!activity) {

    return null;

  }



  return (

    <Modal

      isOpen={isOpen}

      onClose={onClose}

      title={ASSIGNTITLE__TEXTLABEL[LANGUAGE]}

      subtitle={activity.name}

      onConfirm={handleConfirm}

      confirmLabel={isSaving ? SAVING__TEXTLABEL[LANGUAGE] : SAVEBUTTON__TEXTLABEL[LANGUAGE]}

      confirmDisabled={isSaving || isLoading}

      size="md"

      className="activity-assign-modal"

    >

      <div className="activity-assign-modal__toolbar">

        <SearchBar

          value={searchQuery}

          onChange={(event) => setSearchQuery(event.target.value)}

          placeholder={SEARCHPLACEHOLDER__TEXTLABEL[LANGUAGE]}

          name="activity-assign-search"

          className="activity-assign-modal__search"

          aria-label={SEARCHARIALABEL__TEXTLABEL[LANGUAGE]}

        />

      </div>



      {isLoading ? (

        <p className="activity-assign-modal__message">{LOADING__TEXTLABEL[LANGUAGE]}</p>

      ) : null}



      {!isLoading && visibleMembers.length === 0 ? (

        <p className="activity-assign-modal__message">

          {members.length === 0

            ? NOMEMBERS__TEXTLABEL[LANGUAGE]

            : NOSEARCHRESULTS__TEXTLABEL[LANGUAGE]}

        </p>

      ) : null}



      {!isLoading && visibleMembers.length > 0 ? (

        <div className="activity-assign-modal__list">

          {visibleMembers.map((member) => (

            <MemberAssignRow

              key={member.accountId}

              member={member}

              checked={selectedIds.has(member.accountId)}

              onToggle={() => toggleMember(member.accountId)}

            />

          ))}

        </div>

      ) : null}

    </Modal>

  );

}
