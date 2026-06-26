import { useEffect, useState } from 'react';
import { Button, Modal } from '../../../components/ui/index.js';
import TemplateDetailPanel from '../../../components/ui/TemplateDetailPanel/TemplateDetailPanel.jsx';
import TemplateListingCard from '../../../components/ui/TemplateListingCard/TemplateListingCard.jsx';
import { fetchGroupTemplateDetails } from '../../../services/groupTemplates.api.js';
import { getTemplateBannerUrl, getTemplateSummaryStats } from './groupSnapshotForTemplate.js';
import './TemplateDetailsModal.css';

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {import('../../../services/groupTemplates.api.js').GroupTemplateListItem | null} props.template
 * @param {() => void} props.onClose
 */
export default function TemplateDetailsModal({ isOpen, template, onClose }) {
  const [details, setDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    if (!isOpen || !template) {
      setDetails(null);
      return undefined;
    }

    setIsLoadingDetails(true);
    fetchGroupTemplateDetails(template.id)
      .then((result) => setDetails(result))
      .finally(() => setIsLoadingDetails(false));

    return undefined;
  }, [isOpen, template]);

  const data = details?.data;
  const stats = data ? getTemplateSummaryStats(data) : undefined;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Szczegóły szablonu"
      subtitle={template?.name}
      size="xl"
      showFooter={false}
      className="template-details-modal"
    >
      <div className="template-details-modal__body">
        {template ? (
          <div className="template-details-modal__summary" aria-hidden={isLoadingDetails}>
            <TemplateListingCard
              name={template.name}
              description={template.description}
              isPublic={template.isPublic}
              createdAt={template.createdAt}
              bannerUrl={data ? getTemplateBannerUrl(data) : null}
              subjectName={data?.group?.subjectName}
              stats={stats}
            />
          </div>
        ) : null}

        <TemplateDetailPanel
          data={data}
          isLoading={isLoadingDetails}
          className="maq-template-detail-panel--expanded template-details-modal__panel"
        />
      </div>

      <div className="template-details-modal__footer">
        <Button type="button" variant="secondary" onClick={onClose}>
          Zamknij
        </Button>
      </div>
    </Modal>
  );
}
