import { useMemo, useState } from 'react';
import { FeedView } from './components/FeedView';
import { SavedPostsView } from './components/SavedPostsView';
import { createTranslator, type Locale } from './i18n/messages';

export function App() {
  const [tab, setTab] = useState<'feed' | 'saved'>('feed');
  const [locale, setLocale] = useState<Locale>('en');
  const t = useMemo(() => createTranslator(locale), [locale]);

  return <main className="app">
    <div className="toolbar">
      <h1>{t('app.title')}</h1>
      <label>{t('locale.label')} <select className="select" value={locale} onChange={e => setLocale(e.target.value as Locale)}><option value="en">English</option><option value="fr">Français</option></select></label>
    </div>
    <nav className="nav">
      <button className={tab === 'feed' ? 'active' : ''} onClick={() => setTab('feed')}>{t('nav.feed')}</button>
      <button className={tab === 'saved' ? 'active' : ''} onClick={() => setTab('saved')}>{t('nav.saved')}</button>
    </nav>
    {tab === 'feed' ? <FeedView locale={locale} t={t} /> : <SavedPostsView locale={locale} t={t} />}
  </main>;
}
