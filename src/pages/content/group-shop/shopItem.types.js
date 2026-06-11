/**
 * @typedef {Object} ShopItem
 * @property {string} id
 * @property {string} name
 * @property {string} storyDescription
 * @property {string} didacticDescription
 * @property {number} priceAmount
 * @property {number} [salePriceAmount] — cena po zniżce (mniejsza od priceAmount)
 * @property {string} [imageUrl]
 * @property {string[]} [categories]
 * @property {number | null} [categoryId]
 * @property {number | null} [stockQuantity]
 * @property {number | null} [perStudentLimit]
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
