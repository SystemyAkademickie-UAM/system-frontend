import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Divider } from '../../../components/ui/index.js';
import { fetchGroupStudents } from '../../../services/students.api.js';
import { getAvatarImageClassName } from '../../../utils/avatarDisplay.js';
import ProfileEqContentContent from '../group-profile-eq/ProfileEqContentContent.jsx';
import './StudentProfileViewContent.css';

export default function StudentProfileViewContent() {
  const { groupId, studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadStudent() {
      if (!groupId || !studentId) {
        setError('Brak danych uczestnika.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        const students = await fetchGroupStudents(groupId);
        const found = students.find((item) => String(item.accountId) === String(studentId));

        if (cancelled) {
          return;
        }

        if (!found) {
          setStudent(null);
          setError('Nie znaleziono uczestnika w tej grupie.');
        } else {
          setStudent(found);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Nie udało się pobrać danych uczestnika.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadStudent();

    return () => {
      cancelled = true;
    };
  }, [groupId, studentId]);

  const nickname = student?.nickname?.trim() || '';
  const legalName = [student?.name, student?.surname].filter(Boolean).join(' ').trim();
  const displayName = nickname || legalName || 'Uczestnik';

  return (
    <section className="student-profile-view" aria-label={`Profil uczestnika: ${displayName}`}>
      {isLoading ? (
        <p className="student-profile-view__message">Ładowanie profilu uczestnika…</p>
      ) : null}

      {error ? (
        <p className="student-profile-view__error" role="alert">{error}</p>
      ) : null}

      {student ? (
        <>
          <header className="student-profile-view__header">
            <div className="student-profile-view__identity">
              <span className="student-profile-view__avatar-wrap">
                <img
                  src={student.avatarUrl}
                  alt=""
                  className={getAvatarImageClassName(student.avatarUrl, 'student-profile-view__avatar')}
                  loading="lazy"
                />
              </span>
              <div className="student-profile-view__meta">
                <p className="student-profile-view__eyebrow">Profil uczestnika</p>
                <h1 className="student-profile-view__title">{displayName}</h1>
                {nickname && legalName && nickname !== legalName ? (
                  <p className="student-profile-view__legal-name">{legalName}</p>
                ) : null}
              </div>
            </div>
          </header>

          <Divider className="student-profile-view__divider" />

          <ProfileEqContentContent
            studentAccountId={student.accountId}
            readOnly
          />
        </>
      ) : null}
    </section>
  );
}
