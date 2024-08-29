/**
 * Définir une valeur dans localStorage avec TTL
 * @param {string} key - Clé du stockage
 * @param {*} value - Valeur à stocker
 * @param {number} ttl - Durée en millisecondes (TTL)
 */
export function setItemWithTTL(key, value, ttl) {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

/**
 * Obtenir une valeur de localStorage avec TTL
 * @param {string} key - Clé du stockage
 * @returns {*} Valeur stockée ou null si expirée
 */
export function getItemWithTTL(key) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}

/**
 * Effacer une valeur du localStorage
 * @param {string} key - Clé du stockage
 */
export function clearItem(key) {
  localStorage.removeItem(key);
}