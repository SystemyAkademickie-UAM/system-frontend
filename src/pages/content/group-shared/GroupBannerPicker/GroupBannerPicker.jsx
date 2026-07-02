import { useEffect, useRef, useState } from 'react';
import { Button, SubNav } from '../../../../components/ui/index.js';
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
import './GroupBannerPicker.css';

/** @typedef {import('../../../../utils/groupBannerRef.js').BannerPickerValue} BannerPickerValue */

const BANNER_MODE_ITEMS = [
  { id: 'gallery', label: 'Z galerii' },
  { id: 'file', label: 'Własny plik' },
  { id: 'color', label: 'Kolor tła' },
];

/**
 * @param {Object} props
 * @param {BannerPickerValue} props.value
 * @param {(next: BannerPickerValue) => void} props.onChange
 * @param {string} [props.className]
 */
export default function GroupBannerPicker({ value, onChange, className = '' }) {
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
        setUploadError(validation.error ?? 'Nie udało się wczytać pliku.');
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
        <img className="group-banner-picker__preview" src={previewUrl} alt="Podgląd banera z galerii" />
      ) : (
        <div className="group-banner-picker__preview-empty">Wybrano baner z galerii</div>
      );
    }

    if (value.mode === 'file' && value.previewUrl) {
      return (
        <img className="group-banner-picker__preview" src={value.previewUrl} alt="Podgląd własnego banera" />
      );
    }

    return <div className="group-banner-picker__preview-empty">Brak wybranego banera</div>;
  };

  const hasSelection = value.mode !== 'none' && !value.cleared && (
    (value.mode === 'gallery' && value.galleryPath)
    || (value.mode === 'color' && value.color)
    || (value.mode === 'file' && value.previewUrl)
  );

  return (
    <div className={['group-banner-picker', className].filter(Boolean).join(' ')}>
      <SubNav
        ariaLabel="Tryb wyboru banera"
        items={BANNER_MODE_ITEMS}
        activeId={activeMode}
        onSelect={setActiveMode}
        className="group-banner-picker__sub-nav"
      />

      <div className="group-banner-picker__panel">
        {activeMode === 'gallery' ? (
          isGalleryLoading ? (
            <p className="group-banner-picker__hint">Ładowanie galerii banerów…</p>
          ) : galleryItems.length === 0 ? (
            <p className="group-banner-picker__hint">Brak banerów w galerii.</p>
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
                      <img src={previewUrl} alt={item.name || 'Baner'} loading="lazy" decoding="async" />
                    ) : (
                      <span className="group-banner-picker__gallery-fallback">{item.name || 'Baner'}</span>
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
              {value.previewUrl && value.mode === 'file' ? 'Zmień plik banera' : 'Wybierz plik banera'}
            </Button>
            <p className="group-banner-picker__hint">
              Obsługiwane formaty graficzne (PNG, JPG, WebP…). Maksymalny rozmiar:
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
            <label className="group-banner-picker__color-label" htmlFor="group-banner-color-input">
              Wybierz kolor tła
            </label>
            <div className="group-banner-picker__color-row">
              <input
                id="group-banner-color-input"
                type="color"
                className="group-banner-picker__color-input"
                value={value.color}
                onChange={(event) => {
                  onChange({
                    ...value,
                    mode: 'color',
                    color: event.target.value,
                    cleared: false,
                  });
                  setActiveMode('color');
                }}
              />
              <span className="group-banner-picker__color-value">{value.color}</span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="group-banner-picker__summary">
        {previewForMode()}
        {hasSelection ? (
          <button type="button" className="group-banner-picker__remove-btn" onClick={onRemoveClick}>
            Usuń baner
          </button>
        ) : null}
      </div>
    </div>
  );
}
