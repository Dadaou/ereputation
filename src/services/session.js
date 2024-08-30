/**
 * Définir une valeur dans localStorage avec TTL
 */
const setItemWithTTL=(key, value, ttl)=> {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

/**
 * Obtenir une valeur de localStorage avec TTL
 *
 */
const getItemWithTTL=(key)=> {
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


 // Effacer une valeur du localStorage

const clearItem =(key)=> {
  localStorage.removeItem(key);
}

const clearCache =()=>{

  // Vérifiez si le navigateur supporte les service workers
  if ('serviceWorker' in navigator) {
    // Enregistrez le service worker
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for (let registration of registrations) {
        registration.unregister().then(function(success) {
          if (success) {
            console.log('Service worker désenregistré avec succès.');
          }
        }).catch(function(error) {
          console.error('Erreur lors du désenregistrement du service worker:', error);
        });
      }
    });

    // Effacez le cache associé aux service workers
    if ('caches' in window) {
      caches.keys().then(function(cacheNames) {
        cacheNames.forEach(function(cacheName) {
          caches.delete(cacheName).then(function(success) {
            if (success) {
              console.log('Cache effacé:', cacheName);
            }
          });
        });
      });
    }
  }

}

export default {
  clearItem,
  getItemWithTTL,
  setItemWithTTL,
  clearCache
}