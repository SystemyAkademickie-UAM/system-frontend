import { useCallback, useEffect, useMemo, useState } from 'react';

import { Modal, SearchBar, useToast } from '../../../../components/ui/index.js';

import {

  fetchActivityCompletions,

  fetchGroupStudents,

  setActivityCompletions,

} from '../../../../services/students.api.js';



function MemberAssignRow({ member, checked, onToggle }) {

  const displayName = member.nickname?.trim()

    || [member.name, member.surname].filter(Boolean).join(' ').trim()

    || member.email;



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

  const [members, setMembers] = useState([]);

  const [selectedIds, setSelectedIds] = useState(new Set());

  const [searchQuery, setSearchQuery] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [isSaving, setIsSaving] = useState(false);



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

          showError(error instanceof Error ? error.message : 'Nie udało się załadować uczestników');

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

  }, [isOpen, activity, groupId, showError]);



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

        throw new Error(result.error || 'Nie udało się zapisać przypisania aktywności');

      }



      showSuccess('Przypisanie aktywności zostało zapisane.');

      onClose();

    } catch (error) {

      showError(error instanceof Error ? error.message : 'Nie udało się zapisać przypisania');

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

      title="Przypisz aktywność"

      subtitle={activity.name}

      onConfirm={handleConfirm}

      confirmLabel={isSaving ? 'Zapisywanie…' : 'Zapisz'}

      confirmDisabled={isSaving || isLoading}

      size="md"

      className="activity-assign-modal"

    >

      <div className="activity-assign-modal__toolbar">

        <SearchBar

          value={searchQuery}

          onChange={(event) => setSearchQuery(event.target.value)}

          placeholder="Szukaj uczestników…"

          name="activity-assign-search"

          className="activity-assign-modal__search"

          aria-label="Szukaj uczestników"

        />

      </div>



      {isLoading ? (

        <p className="activity-assign-modal__message">Ładowanie uczestników…</p>

      ) : null}



      {!isLoading && visibleMembers.length === 0 ? (

        <p className="activity-assign-modal__message">

          {members.length === 0

            ? 'Brak uczestników w tej grupie.'

            : 'Brak uczestników pasujących do wyszukiwania.'}

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

