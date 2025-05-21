import { createI18n } from 'vue-i18n'

import fr from '../locales/fr/locale.json'
import en from '../locales/en/locale.json'
import sp from '../locales/sp/locale.json'

var lg = localStorage.getItem('langue')

var langues = [
  { name: 'EN', code: 'en' },
  { name: 'FR', code: 'fr' },
  { name: 'SP', code: 'sp' }
]

var langselected = ''
for (let i = 0; i < langues.length; i++) {
  if (langues[i].name == lg) {
    langselected = langues[i].code
  }
}
export const i18n = new createI18n({
  legacy: false,
  locale: langselected,
  fallbackLocale: langselected, // set locale
  allowComposition: true,
  globalInjection: true,
  messages: { sp, fr, en } // set locale messages
})

export default i18n
