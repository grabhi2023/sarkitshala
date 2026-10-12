import SidebarShell from '@/components/blog/SidebarShell';
import { getSidebarItems } from '@/lib/sidebar';
import { DIFFICULTIES, DIFFICULTY_LABELS } from '@/lib/config';

const LATEST_COUNT = 5;

function buildGroups(legacy, posts, category) {
  const toLink = (post) => ({ href: `/${category}/${post.slug}`, text: post.title });
  const postHrefs = new Set(posts.map((post) => `/${category}/${post.slug}`));
  const groups = new Map();

  legacy.forEach((group) => {
    groups.set(group.key, {
      key: group.key,
      label: group.label,
      links: group.links.filter((link) => !postHrefs.has(link.href)),
    });
  });

  const fresh = new Map();
  posts.forEach((post) => {
    const key = post.difficulty || 'basic';
    if (!groups.has(key)) {
      groups.set(key, { key, label: DIFFICULTY_LABELS[key] || key, links: [] });
    }
    if (!fresh.has(key)) fresh.set(key, []);
    fresh.get(key).push(toLink(post));
  });

  fresh.forEach((links, key) => {
    const group = groups.get(key);
    group.links = [...links, ...group.links];
  });

  const ordered = [];

  const latest = posts.slice(0, LATEST_COUNT).map(toLink);
  if (latest.length > 0) ordered.push({ key: 'latest', label: 'Latest Experiments', links: latest });

  DIFFICULTIES.forEach((key) => {
    if (groups.has(key)) {
      ordered.push(groups.get(key));
      groups.delete(key);
    }
  });
  groups.forEach((group) => ordered.push(group));

  return ordered.filter((group) => group.links.length > 0);
}

export default async function CategoryLayout({ category, title, legacy = [], children }) {
  const posts = await getSidebarItems(category);
  const groups = buildGroups(legacy, posts, category);

  return (
    <SidebarShell title={title} groups={groups}>
      {children}
    </SidebarShell>
  );
}