import { useState } from 'react';
import SectionPageLayout from '../../../components/layout/sectionPage/SectionPageLayout.jsx';
import { Divider } from '../../../components/ui/index.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './HelpContent.css';

const TITLE__TEXTLABEL = {
  polish: 'Centrum Pomocy',
  english: 'Help Center',
};

const COORDINATOR_SECTION__TEXTLABEL = {
  polish: 'Zarządzanie projektem i kontakt',
  english: 'Project Management & Contact',
};

const COORDINATOR_ROLE__TEXTLABEL = {
  polish: 'Koordynator projektu:',
  english: 'Project Coordinator:',
};

const AUTHORS_SECTION__TEXTLABEL = {
  polish: 'Twórcy aplikacji',
  english: 'Application Authors',
};

const AUTHORS_SUBTITLE__TEXTLABEL = {
  polish: 'Zespół projektowy i programistyczny:',
  english: 'Development & Design Team:',
};

const AUTHORS_LIST = [
  'Mateusz Młyńczak',
  'Nikita Breslavskyi',
  'Paweł Plewczyński',
  'Eryk Zerbin',
  'Jacek Jakubowicz',
];

export default function HelpContent() {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  return (
    <SectionPageLayout
      className="help-content"
      title={TITLE__TEXTLABEL[LANGUAGE]}
    >
      <div className="help-content__card">
        <div className="help-content__section">
          <h2 className="help-content__section-title">
            {COORDINATOR_SECTION__TEXTLABEL[LANGUAGE]}
          </h2>
          <p className="help-content__label">
            {COORDINATOR_ROLE__TEXTLABEL[LANGUAGE]}
          </p>
          <p className="help-content__person-name">
            Marcin Szczepański
          </p>
          <a
            className="help-content__link"
            href="mailto:marcin.szczepanski@amu.edu.pl"
          >
            marcin.szczepanski@amu.edu.pl
          </a>
        </div>

        <Divider className="help-content__divider" />

        <div className="help-content__section">
          <h2 className="help-content__section-title">
            {AUTHORS_SECTION__TEXTLABEL[LANGUAGE]}
          </h2>
          <p className="help-content__label">
            {AUTHORS_SUBTITLE__TEXTLABEL[LANGUAGE]}
          </p>
          <ul className="help-content__authors-list">
            {AUTHORS_LIST.map((author) => (
              <li key={author} className="help-content__author-item">
                <span className="help-content__author-bullet">•</span>
                <span className="help-content__author-name">{author}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionPageLayout>
  );
}
