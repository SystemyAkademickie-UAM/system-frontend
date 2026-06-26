/**
 * @typedef {Object} ShopItem
 * @property {string} id
 * @property {string} name
 * @property {string} storyDescription
 * @property {string} didacticDescription
 * @property {number} priceAmount
 * @property {number} [salePriceAmount] — cena końcowa po wszystkich zniżkach
 * @property {number} [rankDiscountedPrice] — cena po zniżce rangi (bez odznak)
 * @property {string} [imageUrl]
 * @property {string[]} [categories]
 * @property {number | null} [categoryId]
 * @property {number | null} [stockQuantity]
 * @property {number | null} [perStudentLimit]
 * @property {string | null} [imageRef]
 * @property {boolean} [isPublished]
 * @property {boolean} [isLocked]
 * @property {boolean} [isExtraLife]
 */

/**
 * @typedef {Object} ShopItemTemplate
 * @property {number} id
 * @property {string} name
 * @property {string} storyDescription
 * @property {string} educationalDescription
 * @property {number} basePrice
 */

/**
 * @typedef {Object} InventoryEntry
 * @property {number} id
 * @property {number} enrollmentId
 * @property {number} itemId
 * @property {number} quantity
 * @property {ShopItem} item
 */

export {};
