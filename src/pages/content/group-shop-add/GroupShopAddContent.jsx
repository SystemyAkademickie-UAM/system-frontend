import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SectionPageLayout from '../../../components/layout/sectionPage/SectionPageLayout.jsx';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import '../../../components/page/PageUnavailable.css';
import '../group-settings/GroupSettingsForm.css';
import GroupShopAdd from './GroupShopAddContentContent.jsx';

const EDITINGTITLE__TEXTLABEL = {
  polish: 'Edycja przedmiotu sklepowego',
  english: 'Editing Shop Item'
};

const ADDINGTITLE__TEXTLABEL = {
  polish: 'Dodawanie przedmiotu do sklepu',
  english: 'Adding Item to Shop'
};

export default function GroupShopAddContent() {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const [searchParams] = useSearchParams();
  const editingItemId = searchParams.get('itemId');
  const title = editingItemId ? EDITINGTITLE__TEXTLABEL[LANGUAGE] : ADDINGTITLE__TEXTLABEL[LANGUAGE];

  return (
    <SectionPageLayout
      className="page-unavailable group-settings-page group-shop-add-page"
      title={title}
    >
      <GroupShopAdd />
    </SectionPageLayout>
  );
}
