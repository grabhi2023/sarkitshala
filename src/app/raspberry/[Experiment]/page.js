import { notFound } from 'next/navigation';
import sanitizeHtml from 'sanitize-html';
import getData from '@/app/apiCall';
import PostView from '@/components/blog/PostView';
import {
  getLegacy,
  getPublishedSlugs,
  legacySlugs,
  loadPost,
  pageMetadata,
  postMetadata,
  truncate,
} from '@/lib/blogPage';

const API = 'https://sarkitshala.com/api/experiments/Res';
const META_API = 'https://sarkitshala.com/api/experiments/ResMeta';
const DEFAULT_DESCRIPTION =
  'Explore Raspberry Pi tutorials and projects step by step. Learn about interfacing sensors, displays, and other modules with Raspberry Pi.';

const OUTPUT_OPTIONS = {
  allowedTags: ['strong', 'b', 'em', 'i', 'u', 'code', 'br', 'span', 'p', 'a', 'ul', 'ol', 'li'],
  allowedAttributes: { a: ['href', 'rel', 'target'] },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    a: (tagName, attribs) =>
      attribs.href
        ? { tagName: 'a', attribs: { href: attribs.href, rel: 'noopener noreferrer', target: '_blank' } }
        : { tagName: 'span', attribs: {} },
  },
};

const BOX = 'mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900';

const list = (value) => (Array.isArray(value) ? value : []);
const lines = (value) => (Array.isArray(value) ? value : typeof value === 'string' && value ? value.split('\n') : []);
const isHttp = (value) => typeof value === 'string' && /^https?:\/\//i.test(value);

export async function generateStaticParams() {
  const [legacy, posts] = await Promise.all([
    getData(META_API)
      .then(legacySlugs)
      .catch((error) => {
        console.error('raspberry static params failed:', error.message);
        return [];
      }),
    getPublishedSlugs('raspberry'),
  ]);

  return [...new Set([...legacy, ...posts])].map((Experiment) => ({ Experiment }));
}

export async function generateMetadata({ params }) {
  const { Experiment } = await params;

  const post = await loadPost('raspberry', Experiment);
  if (post) return postMetadata(post, 'raspberry');

  const data = await getLegacy(() => getData(META_API, Experiment));
  if (!data) notFound();

  const title = data.title || 'Raspberry Pi Tutorial';
  return pageMetadata({
    category: 'raspberry',
    slug: Experiment,
    title: `${title} | Sarkitshala`,
    ogTitle: `${title} | Raspberry Pi Projects & Tutorials`,
    description: truncate(data.metaDescription || data.description || DEFAULT_DESCRIPTION),
    image: data.image1,
  });
}

export default async function Page({ params }) {
  const { Experiment } = await params;

  const post = await loadPost('raspberry', Experiment);
  if (post) return <PostView post={post} />;

  const data = await getLegacy(() => getData(API, Experiment));
  if (!data) notFound();

  return <LegacyRaspberryPage data={data} />;
}

function LegacyRaspberryPage({ data }) {
  return (
    <div className="articleContainer">
      <h1>{data.title}</h1>

      {data.description ? (
        <section className={BOX}>
          <p>{data.description}</p>
        </section>
      ) : null}

      {list(data.sections).map((section, index) => (
        <section key={index} className={BOX}>
          {section.heading ? <h2 className="mb-4 text-xl font-bold">{section.heading}</h2> : null}
          {section.content ? <p>{section.content}</p> : null}

          <BulletList items={section.points} />
          <BulletList items={section.items} />
          <StepList steps={section.steps} />
          <CodeLines code={section.code} />

          {section.run_command ? (
            <p className="mt-4">
              <strong>Run Command:</strong> <code>{section.run_command}</code>
            </p>
          ) : null}

          {section.output ? (
            <p className="mt-4" dangerouslySetInnerHTML={{ __html: sanitizeHtml(String(section.output), OUTPUT_OPTIONS) }} />
          ) : null}

          <FaqList faqs={section.faqs} />

          {list(section.links).filter(isHttp).length > 0 ? (
            <ul className="mt-4 space-y-1">
              {list(section.links)
                .filter(isHttp)
                .map((link, i) => (
                  <li key={i}>
                    <a href={link} target="_blank" rel="noopener noreferrer" className="break-all text-blue-600 underline dark:text-blue-400">
                      {link}
                    </a>
                  </li>
                ))}
            </ul>
          ) : null}

          {list(section.subsections).map((sub, i) => (
            <div key={i} className="ml-2 mt-4 border-l-4 border-slate-300 pl-4 dark:border-slate-600 sm:ml-5">
              {sub.subheading ? <h4 className="mb-2 text-lg font-semibold">{sub.subheading}</h4> : null}
              {sub.content ? <p>{sub.content}</p> : null}
              <BulletList items={sub.points} />
              <BulletList items={sub.items} />
              <StepList steps={sub.steps} />
              <CodeLines code={sub.code} />
              <CodeLines code={sub.commands} />
              {sub.note ? (
                <p className="mt-2">
                  <strong>Note:</strong> {sub.note}
                </p>
              ) : null}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

function BulletList({ items }) {
  const rows = list(items);
  if (rows.length === 0) return null;
  return (
    <ul className="mb-2 list-disc space-y-1 pl-5">
      {rows.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function StepList({ steps }) {
  const rows = list(steps);
  if (rows.length === 0) return null;
  return (
    <ol className="mb-2 list-decimal space-y-1 pl-5">
      {rows.map((step, i) => (
        <li key={i}>{step}</li>
      ))}
    </ol>
  );
}

function CodeLines({ code }) {
  const rows = lines(code);
  if (rows.length === 0) return null;
  return (
    <pre className="my-4 overflow-x-auto rounded-lg border border-slate-700 bg-slate-900 p-4 font-mono text-sm text-slate-100">
      {rows.map((line, i) => (
        <code key={i} className="block">
          {line}
        </code>
      ))}
    </pre>
  );
}

function FaqList({ faqs }) {
  const rows = list(faqs);
  if (rows.length === 0) return null;
  return (
    <div className="mt-4 space-y-3">
      {rows.map((faq, i) => (
        <div key={i}>
          <p>
            <strong>Q:</strong> {faq?.question}
          </p>
          <p>
            <strong>A:</strong> {faq?.answer}
          </p>
        </div>
      ))}
    </div>
  );
}