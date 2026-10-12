import Image from 'next/image';
import CodeBox from './code.jsx';

const asArray = (value) => (Array.isArray(value) ? value : []);
const hasText = (value) => typeof value === 'string' && value.trim().length > 0;

function Picture({ src, width, height, alt, priority = false }) {
  if (!hasText(src)) return null;
  return <Image src={src} width={width} height={height} alt={alt} priority={priority} sizes="(max-width: 768px) 100vw, 740px" />;
}

function SectionCard({ children }) {
  return (
    <section className="mb-4 p-5 rounded-xl border border-border bg-muted/30 dark:bg-muted/10 shadow-sm transition-colors">
      {children}
    </section>
  );
}

function Section({ title, content }) {
  return (
    <SectionCard>
      <h2>{title}</h2>
      {hasText(content) ? <p>{content}</p> : null}
    </SectionCard>
  );
}

function Bullets({ items }) {
  const lines = asArray(items);
  if (lines.length === 0) return null;
  return (
    <ul>
      {lines.map((line, i) => (
        <li key={i}>{String(line)}</li>
      ))}
    </ul>
  );
}

function NamedGroups({ groups }) {
  return asArray(groups).map((group, idx) => (
    <div key={idx} className="mb-4">
      {hasText(group?.name) ? <h3>{group.name}</h3> : null}
      <Bullets items={group?.operation} />
    </div>
  ));
}

export default function AllCom({ data }) {
  const title = data?.mainTitle || 'Experiment';
  const code = typeof data?.code === 'string' ? data.code.replace(/\\n/g, '\n') : '';
  const algorithms = asArray(data?.algorithms);

  return (
    <div className="articleContainer">
      {data?.mainTitle && <h1>{data.mainTitle}</h1>}

      <Picture src={data?.image1} width={740} height={800} alt={title} priority />

      {data?.title1 && <Section title={data.title1} content={data.para1} />}
      {data?.title2 && <Section title={data.title2} content={data.para2} />}
      {data?.title5 && <Section title={data.title5} content={data.para5} />}
      {data?.title11 && <Section title={data.title11} content={data.para3} />}
      {data?.title8 && <Section title={data.title8} content={data.para4} />}

      {hasText(data?.arrangement) && (
        <SectionCard>
          <h2>Arrangement</h2>
          <pre>{data.arrangement}</pre>
        </SectionCard>
      )}

      {data?.title3 && asArray(data.types).length > 0 && (
        <SectionCard>
          <h2>{data.title3}</h2>
          {asArray(data.types).map((type, idx) => (
            <div key={idx}>
              {hasText(type?.name) ? <h3>{type.name}</h3> : null}
              <Bullets items={type?.operation} />
            </div>
          ))}
        </SectionCard>
      )}

      {data?.title4 && asArray(data.configurations).length > 0 && (
        <SectionCard>
          <h2>{data.title4}</h2>
          <NamedGroups groups={data.configurations} />
        </SectionCard>
      )}

      <Picture src={data?.image2} width={540} height={500} alt={`${title} diagram`} />

      {data?.title9 && asArray(data.Components).length > 0 && (
        <SectionCard>
          <h2>{data.title9}</h2>
          <Bullets items={data.Components} />
        </SectionCard>
      )}

      {data?.title10 && asArray(data.CircuitConnections).length > 0 && (
        <SectionCard>
          <h2>{data.title10}</h2>
          <NamedGroups groups={data.CircuitConnections} />
        </SectionCard>
      )}

      <Picture src={data?.image3} width={740} height={600} alt={`${title} circuit`} />

      {algorithms.length > 0 && (
        <SectionCard>
          <h2>Algorithm</h2>
          <ol>
            {algorithms.map((algo, idx) => {
              const step = algo?.[`step${idx + 1}`];
              return (
                <li key={idx} className="mb-4">
                  {hasText(step) ? <h3>{step}</h3> : null}
                  <Bullets items={algo?.operation} />
                </li>
              );
            })}
          </ol>
        </SectionCard>
      )}

      {code && (
        <SectionCard>
          <h3 id="Code">Arduino Code</h3>
          <CodeBox code={code} language="cpp" />
        </SectionCard>
      )}

      {asArray(data?.applications).length > 0 && (
        <SectionCard>
          <h2>Applications</h2>
          <Bullets items={data.applications} />
        </SectionCard>
      )}

      {hasText(data?.conclusion) && (
        <SectionCard>
          <h2>Conclusion</h2>
          <p>{data.conclusion}</p>
        </SectionCard>
      )}
    </div>
  );
}