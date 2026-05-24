import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, PageHeader, SubNav } from '../../../components/ui/index.js';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import {
  generateGroupAccessCode,
  getGroupAccessCode,
  saveGroupAccessCode,
} from '../group-shared/groupAccessCodeStorage.js';
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

  useEffect(() => {
    const existingCode = getGroupAccessCode(groupId);
    if (existingCode) {
      setAccessCode(existingCode);
    }
  }, [groupId]);

  const handleGenerate = () => {
    const nextCode = generateGroupAccessCode();
    saveGroupAccessCode(groupId, nextCode);
    setAccessCode(nextCode);
    setCopyMessage('');
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
        {accessCode ? (
          <div className="members-code__result">
            <div className="members-code__code-wrap">
              <span className="members-code__code-label">Aktywny kod dostępu</span>
              <code className="members-code__code">{accessCode}</code>
            </div>
            <Button type="button" variant="secondary" onClick={handleCopy}>
              Kopiuj kod
            </Button>
          </div>
        ) : (
          <div className="members-code__empty">
            <p className="members-code__hint">
              Wygeneruj kod dostępu, który studenci wpiszą na stronie dołączenia do grupy.
            </p>
            <Button type="button" variant="primary" onClick={handleGenerate}>
              Generuj kod dostępu
            </Button>
          </div>
        )}

        {copyMessage ? (
          <p className="members-code__feedback" role="status">{copyMessage}</p>
        ) : null}
      </div>
    </section>
  );
}
