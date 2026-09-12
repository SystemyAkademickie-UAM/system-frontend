import { useState } from 'react';
import {
  devApiTestPath,
  groupsListPath,
} from '../../../routes/pathRegistry.js';
import { Button, PageHeader } from '../../../components/ui/index.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './LoginHubContent.css';

const PAGETITLE__TEXTLABEL = {
  polish: 'Logowanie',
  english: 'Login'
};

const PAGEDESCRIPTION__TEXTLABEL = {
  polish: 'Wybierz kolejny krok:',
  english: 'Choose the next step:'
};

const GROUPSLISTBUTTON__TEXTLABEL = {
  polish: 'Lista grup',
  english: 'Groups List'
};

const DEVAPITESTBUTTON__TEXTLABEL = {
  polish: 'Dev API Test',
  english: 'Dev API Test'
};

export default function LoginHubContent() {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  return (
    <section className="login-hub" aria-labelledby="login-hub-title">
      <PageHeader title={PAGETITLE__TEXTLABEL[LANGUAGE]} description={PAGEDESCRIPTION__TEXTLABEL[LANGUAGE]} />

      <ul className="login-hub__list">
        <li>
          <Button to={groupsListPath()} variant="primary">
            {GROUPSLISTBUTTON__TEXTLABEL[LANGUAGE]}
          </Button>
        </li>
        <li>
          <Button to={devApiTestPath()} variant="secondary">
            {DEVAPITESTBUTTON__TEXTLABEL[LANGUAGE]}
          </Button>
        </li>
      </ul>
    </section>
  );
}
