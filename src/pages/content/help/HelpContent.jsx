import { useState } from 'react';
import SectionPageLayout from '../../../components/layout/sectionPage/SectionPageLayout.jsx';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './HelpContent.css';

const TITLELABELTEXT = {
  polish: 'Centrum Pomocy',
  english: 'Help Center',
  japanese: 'ヘルプセンター',
  kana: 'ヘルプセンター',
};
const EMAILLABELTEXT = {
  polish: 'Adres kontaktowy',
  english: 'Contact Address',
  japanese: '連絡先',
  kana: 'れんらくさき',
};
const PHONELABELTEXT = {
  polish: 'Infolinia',
  english: 'Hotline',
  japanese: 'ホットライン',
  kana: 'ほっとらいん',
};

export default function HelpContent() {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  return (
    <SectionPageLayout
      className="page-unavailable help-content"
      title={TITLELABELTEXT[LANGUAGE]}
    >
      <div className="help-content__section">
        <h2 className="help-content__section-title">{EMAILLABELTEXT[LANGUAGE]}</h2>
        <a className="help-content__link" href="mailto:kontakt@maq.projekt.pl">
          kontakt@maq.projekt.pl
        </a>
      </div>

      <div className="help-content__section">
        <h2 className="help-content__section-title">{PHONELABELTEXT[LANGUAGE]}</h2>
        <p className="help-content__text">555-maq-projekt</p>
        <p className="help-content__text help-content__text--muted">555-call-us</p>
      </div>
    </SectionPageLayout>
  );
}
