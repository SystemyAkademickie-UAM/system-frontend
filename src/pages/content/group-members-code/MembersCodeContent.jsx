import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, PageHeader, SubNav } from '../../../components/ui/index.js';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import { fetchAccessCode, generateAccessCode } from '../../../services/enrollment.api.js';
import '../../../components/page/PageUnavailable.css';
import './MembersCodeContent.css';

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

export default function MembersCodeContent() {
  const { groupId } = useParams();
  const nav = useGroupSubNav('group-members');
  const [accessCode, setAccessCode] = useState('');
  const [copyMessage, setCopyMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!groupId) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadExistingCode() {
      setIsLoading(true);
      setError('');

      const result = await fetchAccessCode(groupId);

      if (cancelled) return;

      setIsLoading(false);

      if (result.ok && result.code) {
        setAccessCode(result.code);
      } else if (!result.ok && result.error) {
        setError(result.error);
      }
    }

    loadExistingCode();

    return () => {
      cancelled = true;
    };
  }, [groupId]);

  const handleGenerate = async () => {
    if (!groupId) return;

    setIsGenerating(true);
    setError('');
    setCopyMessage('');

    const result = await generateAccessCode(groupId);

    setIsGenerating(false);

    if (result.ok && result.code) {
      setAccessCode(result.code);
    } else {
      setError(result.error || 'Nie udało się wygenerować kodu.');
    }
  };

  const handleCopy = async () => {
    if (!accessCode) return;

    try {
      await copyTextToClipboard(accessCode);
      setCopyMessage('Kod skopiowany do schowka.');
    } catch {
      setCopyMessage('Nie udało się skopiować kodu.');
    }
  };

  return (
    <section className="page-unavailable members-code-page" aria-label={nav.sectionTitle}>
      <PageHeader
        title={nav.sectionTitle}
        description="Kody dostępu"
      />

      <SubNav
        ariaLabel={nav.ariaLabel}
        items={nav.items}
        className="page-unavailable__sub-nav"
      />

      <div className="members-code__panel">
        {isLoading ? (
          <p className="members-code__hint">Ładowanie kodu dostępu…</p>
        ) : accessCode ? (
          <div className="members-code__result">
            <div className="members-code__code-wrap">
              <span className="members-code__code-label">Aktywny kod dostępu</span>
              <code className="members-code__code">{accessCode}</code>
            </div>
            <div className="members-code__actions">
              <Button type="button" variant="secondary" onClick={handleCopy}>
                Kopiuj kod
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generowanie...' : 'Generuj nowy kod'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="members-code__empty">
            <p className="members-code__hint">
              Wygeneruj kod dostępu, który studenci wpiszą na stronie dołączenia do grupy.
            </p>
            <Button
              type="button"
              variant="primary"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generowanie...' : 'Generuj kod dostępu'}
            </Button>
          </div>
        )}

        {error ? (
          <p className="members-code__feedback members-code__feedback--error" role="alert">
            {error}
          </p>
        ) : null}

        {copyMessage ? (
          <p className="members-code__feedback" role="status">{copyMessage}</p>
        ) : null}
      </div>
    </section>
  );
}
