import { useEffect, useState } from 'react';
import { fetchPredefinedBanners } from '../../../../services/banners.api.js';
import {
  getPredefinedBannerPath,
  getPredefinedBannerPreviewUrl,
} from '../../../../utils/groupBannerRef.js';
import './GroupBannerPicker.css';

/** @typedef {import('../../../../utils/groupBannerRef.js').BannerPickerValue} BannerPickerValue */

/**
 * @param {Object} props
 * @param {BannerPickerValue} props.value
 * @param {(next: BannerPickerValue) => void} props.onChange
 * @param {string} [props.className]
 */
export default function GroupBannerPicker({ value, onChange, className = '' }) {
  const [galleryItems, setGalleryItems] = useState([]);
  const [isGalleryLoading, setIsGalleryLoading] = useState(true);

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

  const setMode = (mode) => {
    onChange({
      ...value,
      mode,
      cleared: false,
    });
  };

  const onUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }
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
      <div className="group-banner-picker__tabs" role="tablist" aria-label="Tryb wyboru banera">
        <button
          type="button"
          role="tab"
          aria-selected={value.mode === 'gallery'}
          className={[
            'group-banner-picker__tab',
            value.mode === 'gallery' ? 'group-banner-picker__tab--active' : '',
          ].join(' ')}
          onClick={() => setMode('gallery')}
        >
          Z galerii
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={value.mode === 'file'}
          className={[
            'group-banner-picker__tab',
            value.mode === 'file' ? 'group-banner-picker__tab--active' : '',
          ].join(' ')}
          onClick={() => setMode('file')}
        >
          Własny plik
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={value.mode === 'color'}
          className={[
            'group-banner-picker__tab',
            value.mode === 'color' ? 'group-banner-picker__tab--active' : '',
          ].join(' ')}
          onClick={() => setMode('color')}
        >
          Kolor tła
        </button>
      </div>

      <div className="group-banner-picker__panel">
        {value.mode === 'gallery' ? (
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

        {value.mode === 'file' ? (
          <div className="group-banner-picker__file">
            <button type="button" className="group-banner-picker__upload-btn" onClick={onUploadClick}>
              {value.previewUrl ? 'Zmień plik banera' : 'Wybierz plik banera'}
            </button>
            <p className="group-banner-picker__hint">Obsługiwane formaty graficzne (PNG, JPG, WebP…).</p>
          </div>
        ) : null}

        {value.mode === 'color' ? (
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
