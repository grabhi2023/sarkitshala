import dynamic from 'next/dynamic';

const CodeBox = dynamic(() => import('@/components/code.jsx'));

const asArray = (value) => (Array.isArray(value) ? value : []);
const BOX = 'mb-3 p-4 rounded-lg border border-gray-300 shadow-sm';

export default function Esp({ data }) {
  const code = typeof data?.code === 'string' ? data.code.replace(/\\n/g, '\n') : '';
  const workingSteps = asArray(data?.workingSteps);
  const components = asArray(data?.components);
  const pinConfig = asArray(data?.pinConfig);
  const wiring = asArray(data?.wiring);
  const codeExplanation = asArray(data?.codeExplanation);
  const applications = asArray(data?.applications);

  return (
    <div className="articleContainer mt-12 md:mt-8 w-[90%] md:ml-2">
      <main>
        <h1>{data?.mainTitle}</h1>

        {data?.title1 && (
          <section className={BOX}>
            <h2>{data.title1}</h2>
            <p>{data.para1}</p>
          </section>
        )}

        {data?.title2 && (
          <section className={BOX}>
            <h2>{data.title2}</h2>
            <p>{data.para2}</p>

            {workingSteps.length > 0 && (
              <ul className="list-decimal pl-6 mt-4">
                {workingSteps.map((step, idx) => (
                  <li key={idx}>{String(step)}</li>
                ))}
              </ul>
            )}

            {data.formula && <p>Formula: {data.formula}</p>}
          </section>
        )}

        {data?.title3 && components.length > 0 && (
          <section className={BOX}>
            <h2>{data.title3}</h2>
            <ul className="list-disc pl-6">
              {components.map((item, idx) => (
                <li key={idx}>{String(item)}</li>
              ))}
            </ul>
          </section>
        )}

        {data?.title4 && pinConfig.length > 0 && (
          <section className={BOX}>
            <h2>{data.title4}</h2>
            <ul className="list-disc pl-6">
              {pinConfig.map((item, idx) => (
                <li key={idx}>
                  <span className="font-semibold">{item?.pin}</span>: {item?.description}
                </li>
              ))}
            </ul>
            {data.note && <p className="mt-4 italic text-sm text-gray-700">{data.note}</p>}
          </section>
        )}

        {data?.title5 && wiring.length > 0 && (
          <section className={BOX}>
            <h2>{data.title5}</h2>
            <ul className="list-decimal pl-6">
              {wiring.map((item, idx) => (
                <li key={idx}>
                  <span className="font-semibold">{item?.sensorPin}</span> {'->'} {item?.esp32Pin}
                </li>
              ))}
            </ul>
          </section>
        )}

        {data?.title6 && code && (
          <section className={BOX}>
            <h2>{data.title6}</h2>
            <CodeBox code={code} language="cpp" />
          </section>
        )}

        {data?.title7 && codeExplanation.length > 0 && (
          <section className={BOX}>
            <h2>{data.title7}</h2>
            <ul className="list-decimal pl-6">
              {codeExplanation.map((item, idx) => (
                <li key={idx}>
                  <span className="font-semibold">{item?.line}</span>: {item?.explanation}
                </li>
              ))}
            </ul>
          </section>
        )}

        {data?.title8 && applications.length > 0 && (
          <section className={BOX}>
            <h2>{data.title8}</h2>
            <ul className="list-disc pl-6">
              {applications.map((item, idx) => (
                <li key={idx}>{String(item)}</li>
              ))}
            </ul>
          </section>
        )}

        {data?.title9 && data?.conclusion && (
          <section className={BOX}>
            <h2>{data.title9}</h2>
            <p>{data.conclusion}</p>
          </section>
        )}
      </main>
    </div>
  );
}