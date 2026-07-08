import { useSavedPosts, useToggleSave } from '../client/hooks';
import { PostCard } from './PostCard';
import type { Locale } from '../i18n/messages';

type Props = { locale: Locale; t: (key: string) => string };

export function SavedPostsView({ locale, t }: Props) {
  const saved = useSavedPosts();
  const toggle = useToggleSave();

  if (saved.isLoading) return <p>{t('state.loading')}</p>;
  if (saved.isError) return <p className="error">{t('state.error')}</p>;

  return <section>
    <h2>{t('saved.title')}</h2>
    {saved.data.data.length === 0 ? <div className="empty">{t('saved.empty')}</div> : null}
    {saved.data.data.map(post => <PostCard key={post.id} post={post} locale={locale} t={t} disabled={toggle.isPending} onToggle={p => toggle.mutate({ postId: p.id, hasSaved: p.hasSaved })} />)}
  </section>;
}
