import { formatSaves, type Locale } from '../i18n/messages';
import type { HydratedPost } from '../client/types';

type Props = {
  post: HydratedPost;
  locale: Locale;
  t: (key: string) => string;
  onToggle: (post: HydratedPost) => void;
  disabled?: boolean;
};

export function PostCard({ post, locale, t, onToggle, disabled }: Props) {
  return <article className="card">
    <div className="row">
      <div>
        <h3>{post.title}</h3>
        <p>{post.body}</p>
        <p className="muted">{formatSaves(locale, post.savesCount)} · {new Date(post.createdAt).toLocaleString(locale)}</p>
      </div>
      <button className="bookmark" disabled={disabled} onClick={() => onToggle(post)}>
        {post.hasSaved ? `★ ${t('post.unsave')}` : `☆ ${t('post.save')}`}
      </button>
    </div>
  </article>;
}
