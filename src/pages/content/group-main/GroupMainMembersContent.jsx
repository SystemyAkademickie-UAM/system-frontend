import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DataTable } from '../../../components/ui/index.js';
import { fetchGroupStudents } from '../../../services/students.api.js';
import { groupStudentProfilePath } from '../../../routes/pathRegistry.js';
import { getAvatarImageClassName } from '../../../utils/avatarDisplay.js';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { useSession } from '../../../context/SessionContext.jsx';
import { useUserProfile } from '../../../context/UserProfileContext.jsx';
import { useLeaderDisplayPreferences } from '../../../hooks/useLeaderDisplayPreferences.js';
import { fetchGroupPreview } from '../groups-list/groupsList.api.js';
import { buildLecturerMemberRow, generateMemberAvatarFallback } from '../group-members/membersLecturerRow.js';
import GroupMainSubpageHeader from './shared/GroupMainSubpageHeader.jsx';
import './GroupMainMembersContent.css';
import './shared/groupMainSubpageHeader.css';

function buildRows(students, preview, { role, showNickname, user, profileAvatarUrl }) {
  const rows = [];
  const lecturerRow = buildLecturerMemberRow({
    group: preview.group,
    isOwnGroup: preview.isOwner,
    role,
    showNickname,
    user,
    profileAvatarUrl,
  });

  if (lecturerRow) {
    rows.push({
      id: lecturerRow.id,
      accountId: null,
      position: lecturerRow.position,
      nickname: lecturerRow.name,
      avatarUrl: lecturerRow.avatar,
      isLecturer: true,
    });
  }

  students.forEach((student) => {
    const nickname = student.nickname?.trim() || '—';

    rows.push({
      id: String(student.accountId),
      accountId: student.accountId,
      position: rows.length + 1,
      nickname,
      avatarUrl: student.avatarUrl || generateMemberAvatarFallback(student.nickname || student.email),
      isLecturer: false,
    });
  });

  return rows;
}

function GroupMainMembersTableRow({ row, columns }) {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const isClickable = Boolean(groupId && row.accountId && !row.isLecturer);

  const openProfile = () => {
    if (!isClickable) {
      return;
    }
    navigate(groupStudentProfilePath(groupId, row.accountId));
  };

  const handleKeyDown = (event) => {
    if (!isClickable) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProfile();
    }
  };

  return (
    <tr
      className={[
        'data-table__row',
        row.isLecturer ? 'group-main-members__row--lecturer' : '',
        isClickable ? 'group-main-members__row--clickable' : '',
      ].filter(Boolean).join(' ')}
      onClick={isClickable ? openProfile : undefined}
      onKeyDown={handleKeyDown}
      tabIndex={isClickable ? 0 : undefined}
      role={isClickable ? 'link' : undefined}
      aria-label={isClickable ? `Profil uczestnika: ${row.nickname}` : undefined}
    >
      {columns.map((column) => (
        <td
          key={column.key}
          className={[
            'data-table__cell',
            column.cellClassName,
            column.hiddenBelow ? `data-table__cell--hide-below-${column.hiddenBelow}` : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {column.render ? column.render(row) : String(row[column.key] ?? '')}
        </td>
      ))}
    </tr>
  );
}

export default function GroupMainMembersContent() {
  const { groupId } = useParams();
  const { role } = useAppRole();
  const { user } = useSession();
  const { avatarUrl: profileAvatarUrl } = useUserProfile();
  const { showNickname } = useLeaderDisplayPreferences();
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!groupId) {
        setError('Brak identyfikatora grupy.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        const [students, preview] = await Promise.all([
          fetchGroupStudents(groupId),
          fetchGroupPreview(groupId),
        ]);

        if (cancelled) {
          return;
        }

        setMembers(buildRows(students, preview, {
          role,
          showNickname,
          user,
          profileAvatarUrl,
        }));
      } catch (loadError) {
        if (!cancelled) {
          console.error('Failed to load group main members:', loadError);
          setError('Nie udało się pobrać listy uczestników.');
          setMembers([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [groupId, role, showNickname, user, profileAvatarUrl]);

  const columns = useMemo(
    () => [
      {
        key: 'nickname',
        label: 'Ksywka',
        sort: 'text',
        cellClassName: 'group-main-members__cell--nickname',
        render: (row) => (
          <span className="group-main-members__name-cell">
            {row.avatarUrl ? (
              <img
                src={row.avatarUrl}
                alt=""
                className={getAvatarImageClassName(row.avatarUrl, 'group-main-members__avatar')}
              />
            ) : (
              <span className="group-main-members__avatar group-main-members__avatar--placeholder" aria-hidden="true" />
            )}
            <span className="group-main-members__nickname">{row.nickname}</span>
          </span>
        ),
      },
    ],
    [],
  );

  if (isLoading) {
    return <p className="group-main-members__message">Ładowanie uczestników…</p>;
  }

  if (error) {
    return (
      <p className="group-main-members__message group-main-members__message--error" role="alert">
        {error}
      </p>
    );
  }

  return (
    <div className="group-main-members">
      <GroupMainSubpageHeader eyebrow="Poszukiwacze przygód" title="Uczestnicy" />

      <DataTable
        className="group-main-members__table"
        columns={columns}
        data={members}
        tiebreakerKey="position"
        renderRow={GroupMainMembersTableRow}
        search={{
          placeholder: 'Szukaj po ksywce',
          filter: (row, query) => row.nickname.toLowerCase().includes(query.toLowerCase()),
        }}
      />
    </div>
  );
}
