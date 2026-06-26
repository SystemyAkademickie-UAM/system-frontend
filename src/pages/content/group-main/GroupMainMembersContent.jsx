import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DataTable } from '../../../components/ui/index.js';
import { fetchMembersPageStudents } from '../../../services/groupParticipants.api.js';
import { fetchGroupPreview } from '../../../services/groups.api.js';
import { groupStudentProfilePath } from '../../../routes/pathRegistry.js';
import { getAvatarImageClassName } from '../../../utils/avatarDisplay.js';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { useUserProfile } from '../../../context/UserProfileContext.jsx';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import { buildLecturerMemberRow, generateMemberAvatarFallback } from '../../../utils/members/membersLecturerRow.js';
import GroupMainSubpageHeader from './shared/GroupMainSubpageHeader.jsx';
import './GroupMainMembersContent.css';
import './shared/groupMainSubpageHeader.css';

function buildRows(students, preview, { role, profileAvatarUrl }) {
  const rows = [];
  const lecturerRow = buildLecturerMemberRow({
    group: preview.group,
    isOwnGroup: preview.isOwner,
    role,
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

function GroupMainMembersTableRow({ row, columns, canOpenProfiles }) {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const isClickable = canOpenProfiles && Boolean(groupId && row.accountId && !row.isLecturer);

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
  const { avatarUrl: profileAvatarUrl } = useUserProfile();
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
        const isStudentView = role === APP_ROLE.STUDENT;
        const [students, preview] = await Promise.all([
          fetchMembersPageStudents(groupId, { isStudentView }),
          fetchGroupPreview(groupId),
        ]);

        if (cancelled) {
          return;
        }

        if (!preview.group && students.length === 0) {
          setError('Nie udało się pobrać listy uczestników.');
          setMembers([]);
          return;
        }

        setMembers(buildRows(students, preview, {
          role,
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
  }, [groupId, role, profileAvatarUrl]);

  const canOpenProfiles = role !== APP_ROLE.STUDENT;

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
        renderRow={(props) => (
          <GroupMainMembersTableRow {...props} canOpenProfiles={canOpenProfiles} />
        )}
        search={{
          placeholder: 'Szukaj po ksywce',
          filter: (row, query) => row.nickname.toLowerCase().includes(query.toLowerCase()),
        }}
      />
    </div>
  );
}
