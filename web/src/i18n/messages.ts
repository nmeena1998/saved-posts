export type Locale = 'en' | 'fr';

type Messages = Record<string, string>;

const messages: Record<Locale, Messages> = {
  en: {
    'app.title': 'Community Forum',
    'nav.feed': 'Feed',
    'nav.saved': 'Saved',
    'feed.title': 'Discussion Feed',
    'saved.title': 'Saved Posts',
    'saved.empty': 'You have not saved any posts yet.',
    'post.save': 'Save',
    'post.unsave': 'Unsave',
    'post.saves.one': '1 save',
    'post.saves.other': '{count} saves',
    'state.loading': 'Loading...',
    'state.error': 'Something went wrong.',
    'locale.label': 'Locale',
  },
  fr: {
    'app.title': 'Forum communautaire',
    'nav.feed': 'Fil',
    'nav.saved': 'Enregistrés',
    'feed.title': 'Fil de discussion',
    'saved.title': 'Publications enregistrées',
    'saved.empty': 'Vous n’avez encore enregistré aucune publication.',
    'post.save': 'Enregistrer',
    'post.unsave': 'Retirer',
    'post.saves.one': '1 enregistrement',
    'post.saves.other': '{count} enregistrements',
    'state.loading': 'Chargement...',
    'state.error': 'Une erreur est survenue.',
    'locale.label': 'Langue',
  },
};

export function createTranslator(locale: Locale) {
  return function t(key: string, values?: Record<string, string | number>) {
    const template = messages[locale][key] ?? key;
    return Object.entries(values ?? {}).reduce((result, [name, value]) => result.replace(`{${name}}`, String(value)), template);
  };
}

export function formatSaves(locale: Locale, count: number) {
  const t = createTranslator(locale);
  return count === 1 ? t('post.saves.one') : t('post.saves.other', { count });
}
