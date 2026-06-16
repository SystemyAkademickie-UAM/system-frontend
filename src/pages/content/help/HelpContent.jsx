import { useState } from 'react';
import SectionPageLayout from '../../../components/layout/sectionPage/SectionPageLayout.jsx';
import './HelpContent.css';

const HELP_LABELS = {
  polish: {
    title: 'Centrum Pomocy',
    emailTitle: 'Adres kontaktowy',
    phoneTitle: 'Infolinia',
  },
  english: {
    title: 'Help Center',
    emailTitle: 'Contact Address',
    phoneTitle: 'Hotline',
  },
  japanese: {
    title: 'ヘルプセンター',
    emailTitle: '連絡先',
    phoneTitle: 'ホットライン',
  },
  kana: {
    title: 'ヘルプセンター',
    emailTitle: 'れんらくさき',
    phoneTitle: 'ほっとらいん',
  },
};

function readLanguageCookie() {
  const cookies = Object.fromEntries(
    document.cookie.split(';').map((entry) => {
      const [key, value] = entry.split('=');
      return [key.trim(), value];
    }),
  );
  return cookies.currentlanguage || 'polish';
}

export default function HelpContent() {
  const [language] = useState(readLanguageCookie);
  const labels = HELP_LABELS[language] || HELP_LABELS.polish;

  return (
    <SectionPageLayout
      className="page-unavailable help-content"
      title={labels.title}
    >
      <div className="help-content__section">
        <h2 className="help-content__section-title">{labels.emailTitle}</h2>
        <a className="help-content__link" href="mailto:kontakt@maq.projekt.pl">
          kontakt@maq.projekt.pl
        </a>
      </div>

      <div className="help-content__section">
        <h2 className="help-content__section-title">{labels.phoneTitle}</h2>
        <p className="help-content__text">555-maq-projekt</p>
        <p className="help-content__text help-content__text--muted">555-call-us</p>
      </div>
    </SectionPageLayout>
  );
}
