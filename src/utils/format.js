/**
 * Format a number as Russian ruble string.
 * @param {number} amount
 * @returns {string}  e.g. "4 500 сом"
 */
export function formatRub(amount) {
  return new Intl.NumberFormat('ru-RU').format(amount) + ' сом';
}

/**
 * Calculate percentage discount.
 * @param {number} price
 * @param {number} oldPrice
 * @returns {number}
 */
export function discountPercent(price, oldPrice) {
  return Math.round((1 - price / oldPrice) * 100);
}
