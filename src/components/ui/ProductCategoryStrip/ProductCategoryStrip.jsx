import {
  DEFAULT_CATEGORY_COLOR,
  getContrastingCategoryTextColor,
} from '../../../utils/shop/shopCategoryColors.js';
import './ProductCategoryStrip.css';

/**
 * Pasek kategorii na prawej krawędzi kafelka produktu.
 * Domyślnie: ucięte kule wyrównane do prawej ścianki.
 * Po najechaniu na kartę: rozwinięte pełne nazwy kategorii.
 *
 * @param {{
 *   categories?: Array<{ id?: string | number, name: string, color?: string | null }>,
 *   className?: string,
 * }} props
 */
export default function ProductCategoryStrip({ categories = [], className = '' }) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div
      className={['maq-product-category-strip', className].filter(Boolean).join(' ')}
      aria-label={`Kategorie: ${categories.map((category) => category.name).join(', ')}`}
    >
      <ul className="maq-product-category-strip__list">
        {categories.map((category, index) => {
          const categoryColor = category.color ?? DEFAULT_CATEGORY_COLOR;
          const labelTextColor = getContrastingCategoryTextColor(categoryColor);

          return (
          <li
            key={category.id ?? `category-${index}`}
            className="maq-product-category-strip__item"
          >
            <span
              className="maq-product-category-strip__orb"
              style={{ backgroundColor: categoryColor }}
              aria-hidden="true"
            />
            <span
              className="maq-product-category-strip__label"
              style={{
                backgroundColor: categoryColor,
                color: labelTextColor,
              }}
            >
              {category.name}
            </span>
          </li>
          );
        })}
      </ul>
    </div>
  );
}
