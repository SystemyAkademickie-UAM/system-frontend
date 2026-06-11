import './GroupShopAddForm.css';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, useToast } from '../../../components/ui/index.js';
import { groupShopPath } from '../../../routes/pathRegistry.js';
import {
  createGroupShopItem,
  createGroupShopItemFromTemplate,
  fetchShopTemplates,
} from '../../../services/shop.api.js';
import './GroupShopAddForm.css';

const TABS = {
  templates: 'templates',
  custom: 'custom',
};

export default function GroupShopAddForm() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [activeTab, setActiveTab] = useState(TABS.templates);
  const [templates, setTemplates] = useState([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [templateBasePrice, setTemplateBasePrice] = useState('');
  const [templateStockQuantity, setTemplateStockQuantity] = useState('');
  const [templatePerStudentLimit, setTemplatePerStudentLimit] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [customForm, setCustomForm] = useState({
    name: '',
    basePrice: '',
    storyDescription: '',
    educationalDescription: '',
    stockQuantity: '',
    perStudentLimit: '',
  });

  useEffect(() => {
    let cancelled = false;
    setIsLoadingTemplates(true);
    fetchShopTemplates().then((result) => {
      if (cancelled) {
        return;
      }
      setIsLoadingTemplates(false);
      if (result.ok) {
        setTemplates(result.templates);
        if (result.templates.length > 0) {
          setSelectedTemplateId(result.templates[0].id);
          setTemplateBasePrice(String(result.templates[0].basePrice));
        }
      } else {
        showError(result.error ?? 'Nie udało się pobrać szablonów sklepu.');
      }
    });
    return () => { cancelled = true; };
  }, [showError]);

  const handleTemplateSelect = useCallback((template) => {
    setSelectedTemplateId(template.id);
    setTemplateBasePrice(String(template.basePrice));
  }, []);

  const handleCustomChange = (field) => (event) => {
    setCustomForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const goBackToShop = useCallback(() => {
    if (groupId) {
      navigate(groupShopPath(groupId));
    }
  }, [groupId, navigate]);

  const handleTemplateSubmit = async () => {
    if (!groupId || !selectedTemplateId) {
      return;
    }

    /** @type {Record<string, unknown>} */
    const payload = { templateId: selectedTemplateId };
    if (templateBasePrice.trim() !== '') {
      payload.basePrice = Number(templateBasePrice);
    }
    if (templateStockQuantity.trim() !== '') {
      payload.stockQuantity = Number(templateStockQuantity);
    }
    if (templatePerStudentLimit.trim() !== '') {
      payload.perStudentLimit = Number(templatePerStudentLimit);
    }

    setIsSaving(true);
    const result = await createGroupShopItemFromTemplate(groupId, payload);
    setIsSaving(false);

    if (!result.ok) {
      showError(result.error ?? 'Nie udało się dodać produktu ze szablonu.');
      return;
    }

    showSuccess('Produkt został dodany do sklepu.');
    goBackToShop();
  };

  const handleCustomSubmit = async () => {
    if (!groupId) {
      return;
    }

    const name = customForm.name.trim();
    const basePrice = Number(customForm.basePrice);
    if (!name || !Number.isFinite(basePrice) || basePrice < 0) {
      showError('Podaj nazwę i poprawną cenę bazową.');
      return;
    }

    /** @type {Record<string, unknown>} */
    const payload = {
      name,
      basePrice,
    };

    if (customForm.storyDescription.trim()) {
      payload.storyDescription = customForm.storyDescription.trim();
    }
    if (customForm.educationalDescription.trim()) {
      payload.educationalDescription = customForm.educationalDescription.trim();
    }
    if (customForm.stockQuantity.trim() !== '') {
      payload.stockQuantity = Number(customForm.stockQuantity);
    }
    if (customForm.perStudentLimit.trim() !== '') {
      payload.perStudentLimit = Number(customForm.perStudentLimit);
    }

    setIsSaving(true);
    const result = await createGroupShopItem(groupId, payload);
    setIsSaving(false);

    if (!result.ok) {
      showError(result.error ?? 'Nie udało się utworzyć produktu.');
      return;
    }

    showSuccess('Produkt został dodany do sklepu.');
    goBackToShop();
  };

  return (
    <div className="group-shop-add-form">
      <div className="group-shop-add-form__tabs" role="tablist" aria-label="Tryb dodawania produktu">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === TABS.templates}
          className={[
            'group-shop-add-form__tab',
            activeTab === TABS.templates ? 'group-shop-add-form__tab--active' : '',
          ].join(' ')}
          onClick={() => setActiveTab(TABS.templates)}
        >
          Ze szablonu
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === TABS.custom}
          className={[
            'group-shop-add-form__tab',
            activeTab === TABS.custom ? 'group-shop-add-form__tab--active' : '',
          ].join(' ')}
          onClick={() => setActiveTab(TABS.custom)}
        >
          Własny produkt
        </button>
      </div>

      {activeTab === TABS.templates ? (
        <div className="group-shop-add-form__panel">
          {isLoadingTemplates ? (
            <p className="group-shop-add-form__hint">Ładowanie szablonów…</p>
          ) : templates.length === 0 ? (
            <p className="group-shop-add-form__hint">Brak dostępnych szablonów produktów.</p>
          ) : (
            <>
              <div className="group-shop-add-form__template-grid">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    className={[
                      'group-shop-add-form__template-card',
                      selectedTemplateId === template.id ? 'group-shop-add-form__template-card--active' : '',
                    ].join(' ')}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <span className="group-shop-add-form__template-name">{template.name}</span>
                    <span className="group-shop-add-form__template-price">{template.basePrice} waluty</span>
                    {template.educationalDescription ? (
                      <span className="group-shop-add-form__template-desc">{template.educationalDescription}</span>
                    ) : null}
                  </button>
                ))}
              </div>

              <div className="group-shop-add-form__fields">
                <label className="group-shop-add-form__field">
                  <span>Cena bazowa (opcjonalnie)</span>
                  <input type="number" min="0" value={templateBasePrice} onChange={(e) => setTemplateBasePrice(e.target.value)} />
                </label>
                <label className="group-shop-add-form__field">
                  <span>Stan magazynowy (opcjonalnie)</span>
                  <input type="number" min="0" value={templateStockQuantity} onChange={(e) => setTemplateStockQuantity(e.target.value)} />
                </label>
                <label className="group-shop-add-form__field">
                  <span>Limit na studenta (opcjonalnie)</span>
                  <input type="number" min="0" value={templatePerStudentLimit} onChange={(e) => setTemplatePerStudentLimit(e.target.value)} />
                </label>
              </div>
            </>
          )}

          <div className="group-shop-add-form__footer">
            <Button variant="ghost" size="md" onClick={goBackToShop}>Anuluj</Button>
            <Button variant="primary" size="md" onClick={handleTemplateSubmit} disabled={isSaving || !selectedTemplateId}>
              {isSaving ? 'Dodawanie…' : 'Dodaj ze szablonu'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="group-shop-add-form__panel">
          <div className="group-shop-add-form__fields group-shop-add-form__fields--stack">
            <label className="group-shop-add-form__field">
              <span>Nazwa *</span>
              <input value={customForm.name} onChange={handleCustomChange('name')} />
            </label>
            <label className="group-shop-add-form__field">
              <span>Cena bazowa *</span>
              <input type="number" min="0" value={customForm.basePrice} onChange={handleCustomChange('basePrice')} />
            </label>
            <label className="group-shop-add-form__field">
              <span>Opis fabularny</span>
              <textarea rows={3} value={customForm.storyDescription} onChange={handleCustomChange('storyDescription')} />
            </label>
            <label className="group-shop-add-form__field">
              <span>Opis edukacyjny</span>
              <textarea rows={3} value={customForm.educationalDescription} onChange={handleCustomChange('educationalDescription')} />
            </label>
            <label className="group-shop-add-form__field">
              <span>Stan magazynowy</span>
              <input type="number" min="0" value={customForm.stockQuantity} onChange={handleCustomChange('stockQuantity')} />
            </label>
            <label className="group-shop-add-form__field">
              <span>Limit na studenta</span>
              <input type="number" min="0" value={customForm.perStudentLimit} onChange={handleCustomChange('perStudentLimit')} />
            </label>
          </div>

          <div className="group-shop-add-form__footer">
            <Button variant="ghost" size="md" onClick={goBackToShop}>Anuluj</Button>
            <Button variant="primary" size="md" onClick={handleCustomSubmit} disabled={isSaving}>
              {isSaving ? 'Dodawanie…' : 'Utwórz produkt'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
