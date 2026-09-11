import { useEffect, useRef, useState } from 'react';
import { Button, ColorPickerField, SubNav } from '../../../../components/ui/index.js';
import { fetchPredefinedBanners } from '../../../../services/banners.api.js';
import {
  getPredefinedBannerPath,
  getPredefinedBannerPreviewUrl,
  serializeBannerPickerValue,
} from '../../../../utils/groupBannerRef.js';
import {
  getGroupBannerMaxFileSizeLabel,
  validateGroupBannerFile,
} from '../../../../utils/groupBannerUpload.js';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';
import './GroupBannerPicker.css';

const BANNERMODE__TEXTLABEL = {
  polish: [
    {id: 'gallery', label: 'Z galerii'},
    {id: 'file', label: 'Własny plik'},
    {id: 'color', label: 'Kolor tła'},
  ],
  english: [
    {id: 'gallery', label: 'From gallery'},
    {id: 'file', label: 'Custom file'},
    {id: 'color', label: 'Background color'},
  ],
};

const FILEUPLOADERROR__TEXTLABEL = {
  polish: 'Nie udało się wczytać pliku.',
  english: 'Failed to load file.',
};

const GALLERYBANNERPREVIEW__TEXTLABEL = {
  polish: 'Podgląd banera z galerii',
  english: 'Banner gallery preview',
};

const NOBANNERSELECTED__TEXTLABEL = {
  polish: 'Brak wybranego banera',
  english: 'No banner selected',
};

const CUSTOMBANNERPREVIEW__TEXTLABEL = {
  polish: 'Podgląd własnego banera',
  english: 'Custom banner preview',
};

const BANNER__TEXTLABEL = {
  polish: 'Baner',
  english: 'Banner',
};

const BANNERSELECTIONMODE__TEXTLABEL = {
  polish: 'Tryb wyboru banera',
  english: 'Banner selection mode',
};

const LOADINGGALLERY__TEXTLABEL = {
  polish: 'Ładowanie galerii banerów…',
  english: 'Loading banner gallery…',
};

const EMPTYGALLERY__TEXTLABEL = {
  polish: 'Brak banerów w galerii.',
  english: 'No banners in gallery.',
};

const CHANGEBANNERFILE__TEXTLABEL = {
  polish: 'Zmień plik banera',
  english: 'Change banner file',
};

const SELECTBANNERFILE__TEXTLABEL = {
  polish: 'Wybierz plik banera',
  english: 'Select banner file',
};

const SUPPORTEDFORMATS__TEXTLABEL = {
  polish: 'Obsługiwane formaty graficzne (PNG, JPG, WebP…). Maksymalny rozmiar: ',
  english: 'Supported image formats (PNG, JPG, WebP…). Maximum size: ',
};

const SELECTBACKGROUND__TEXTLABEL = {
  polish: 'Wybierz kolor tła',
  english: 'Select background color',
};

const REMOVEBANNER__TEXTLABEL = {
  polish: 'Usuń baner',
  english: 'Remove banner',
};

/** @typedef {import('../../../../utils/groupBannerRef.js').BannerPickerValue} BannerPickerValue */


/**
 * @param {Object} props
 * @param {BannerPickerValue} props.value
 * @param {(next: BannerPickerValue) => void} props.onChange
 * @param {string} [props.className]
 */
export default function GroupBannerPicker({ value, onChange, className = '' }) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const [galleryItems, setGalleryItems] = useState([]);
  const [isGalleryLoading, setIsGalleryLoading] = useState(true);
  const [activeMode, setActiveMode] = useState(value.mode);
  const [uploadError, setUploadError] = useState('');
  const persistedSnapshotRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setIsGalleryLoading(true);
    fetchPredefinedBanners()
      .then((items) => {
        if (!cancelled) {
          setGalleryItems(items);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsGalleryLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const snapshot = serializeBannerPickerValue(value);

    if (persistedSnapshotRef.current === null) {
      persistedSnapshotRef.current = snapshot;
      setActiveMode(value.mode);
      return;
    }

    if (snapshot !== persistedSnapshotRef.current) {
      persistedSnapshotRef.current = snapshot;
      setActiveMode(value.mode);
    }
  }, [value]);

  const onUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      const validation = validateGroupBannerFile(file);
      if (!validation.valid) {
        setUploadError(validation.error ?? FILEUPLOADERROR__TEXTLABEL[LANGUAGE]);
        return;
      }

      setUploadError('');
      const reader = new FileReader();
      reader.onload = () => {
        onChange({
          ...value,
          mode: 'file',
          file,
          previewUrl: typeof reader.result === 'string' ? reader.result : null,
          existingDriveRef: null,
          cleared: false,
        });
        setActiveMode('file');
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const onRemoveClick = () => {
    onChange({
      mode: 'none',
      galleryPath: null,
      color: value.color,
      file: null,
      previewUrl: null,
      existingDriveRef: null,
      cleared: true,
    });
    setActiveMode('gallery');
  };

  const previewForMode = () => {
    if (value.mode === 'color') {
      return (
        <div
          className="group-banner-picker__preview group-banner-picker__preview--color"
          style={{ backgroundColor: value.color }}
          aria-hidden="true"
        />
      );
    }

    if (value.mode === 'gallery' && value.galleryPath) {
      const previewUrl = value.previewUrl || getPredefinedBannerPreviewUrl(value.galleryPath);
      return previewUrl ? (
        <img className="group-banner-picker__preview" src={previewUrl} alt={GALLERYBANNERPREVIEW__TEXTLABEL[LANGUAGE]} />
      ) : (
        <div className="group-banner-picker__preview-empty">{NOBANNERSELECTED__TEXTLABEL[LANGUAGE]}</div>
      );
    }

    if (value.mode === 'file' && value.previewUrl) {
      return (
        <img className="group-banner-picker__preview" src={value.previewUrl} alt={CUSTOMBANNERPREVIEW__TEXTLABEL[LANGUAGE]} />
      );
    }

    return <div className="group-banner-picker__preview-empty">{NOBANNERSELECTED__TEXTLABEL[LANGUAGE]}</div>;
  };

  const hasSelection = value.mode !== 'none' && !value.cleared && (
    (value.mode === 'gallery' && value.galleryPath)
    || (value.mode === 'color' && value.color)
    || (value.mode === 'file' && value.previewUrl)
  );

  return (
    <div className={['group-banner-picker', className].filter(Boolean).join(' ')}>
      <SubNav
        ariaLabel={BANNERSELECTIONMODE__TEXTLABEL[LANGUAGE]}
        items={BANNERMODE__TEXTLABEL[LANGUAGE]}
        activeId={activeMode}
        onSelect={setActiveMode}
        className="group-banner-picker__sub-nav"
      />

      <div className="group-banner-picker__panel">
        {activeMode === 'gallery' ? (
          isGalleryLoading ? (
            <p className="group-banner-picker__hint">{LOADINGGALLERY__TEXTLABEL[LANGUAGE]}</p>
          ) : galleryItems.length === 0 ? (
            <p className="group-banner-picker__hint">{EMPTYGALLERY__TEXTLABEL[LANGUAGE]}</p>
          ) : (
            <div className="group-banner-picker__gallery" role="list">
              {galleryItems.map((item) => {
                const path = getPredefinedBannerPath(item);
                const previewUrl = getPredefinedBannerPreviewUrl(path);
                const isActive = value.galleryPath === path;

                return (
                  <button
                    key={path ?? item.id}
                    type="button"
                    role="listitem"
                    className={[
                      'group-banner-picker__gallery-item',
                      isActive ? 'group-banner-picker__gallery-item--active' : '',
                    ].join(' ')}
                    onClick={() => {
                      if (!path) {
                        return;
                      }
                      onChange({
                        ...value,
                        mode: 'gallery',
                        galleryPath: path,
                        previewUrl: previewUrl ?? null,
                        file: null,
                        existingDriveRef: null,
                        cleared: false,
                      });
                      setActiveMode('gallery');
                    }}
                  >
                    {previewUrl ? (
                      <img src={previewUrl} alt={`${item.name || ''} ${BANNER__TEXTLABEL[LANGUAGE]}`} loading="lazy" decoding="async" />
                    ) : (
                      <span className="group-banner-picker__gallery-fallback">{item.name || BANNER__TEXTLABEL[LANGUAGE]}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )
        ) : null}

        {activeMode === 'file' ? (
          <div className="group-banner-picker__file">
            <Button type="button" variant="secondary" size="md" onClick={onUploadClick}>
              {value.previewUrl && value.mode === 'file' ? CHANGEBANNERFILE__TEXTLABEL[LANGUAGE] : SELECTBANNERFILE__TEXTLABEL[LANGUAGE]}
            </Button>
            <p className="group-banner-picker__hint">
              {SUPPORTEDFORMATS__TEXTLABEL[LANGUAGE]}
              {' '}
              {getGroupBannerMaxFileSizeLabel()}.
            </p>
            {uploadError ? (
              <p className="group-banner-picker__error" role="alert">{uploadError}</p>
            ) : null}
          </div>
        ) : null}

        {activeMode === 'color' ? (
          <div className="group-banner-picker__color">
            <label className="group-banner-picker__color-label">
              {SELECTBACKGROUND__TEXTLABEL[LANGUAGE]}
            </label>
            <div className="group-banner-picker__color-row">
              <ColorPickerField
                value={value.color}
                onChange={(newColor) => {
                  onChange({
                    ...value,
                    mode: 'color',
                    color: newColor,
                    cleared: false,
                  });
                  setActiveMode('color');
                }}
                title="Wybierz kolor tła"
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className="group-banner-picker__summary">
        {previewForMode()}
        {hasSelection ? (
          <button type="button" className="group-banner-picker__remove-btn" onClick={onRemoveClick}>
            {REMOVEBANNER__TEXTLABEL[LANGUAGE]}
          </button>
        ) : null}
      </div>
    </div>
  );
}
