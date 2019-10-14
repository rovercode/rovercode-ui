/* eslint-disable-next-line import/no-extraneous-dependencies */
const manageTranslations = require('react-intl-translations-manager').default;

manageTranslations({
  messagesDirectory: 'src/translations/extracted',
  translationsDirectory: 'src/translations/locales',
  singleMessagesFile: true,
  languages: ['en', 'es'],
});
