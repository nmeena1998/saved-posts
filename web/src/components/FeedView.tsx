import { useFeed, useToggleSave } from '../client/hooks';
import { PostCard } from './PostCard';
import type { Locale } from '../i18n/messages';

type Props = { locale: Locale; t: (key: string) => string };

export function FeedView({ locale, t }: Props) {
  const feed = useFeed('course-1');
  const toggle = useToggleSave();

  if (feed.isLoading) return <p>{t('state.loading')}</p>;
  if (feed.isError) return <p className="error">{t('state.error')}</p>;

  return <section>
    <h2>{t('feed.title')}</h2>
    {feed.data.data.map(post => <PostCard key={post.id} post={post} locale={locale} t={t} disabled={toggle.isPending} onToggle={p => toggle.mutate({ postId: p.id, hasSaved: p.hasSaved })} />)}
  </section>;
}
