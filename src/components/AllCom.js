import Image from "next/image";
import CodeBox from './code.jsx';

export default function AllCom({ data }) {
  return (
    <div className="articleContainer">

      {/* Main Title */}
      {data.mainTitle && <h1>{data.mainTitle}</h1>}

      {/* Hero Image */}
      {data.image1 && (
        <Image
          src={data.image1}
          height={800}
          width={740}
          alt={data.mainTitle || "Experiment image"}
          priority
        />
      )}

      {/* Basic sections — ✅ Fixed: title5 was using para2 (bug), now uses para5 */}
      {data.title1 && <Section title={data.title1} content={data.para1} />}
      {data.title2 && <Section title={data.title2} content={data.para2} />}
      {data.title5 && <Section title={data.title5} content={data.para5} />}
      {data.title11 && <Section title={data.title11} content={data.para3} />}
      {data.title8 && <Section title={data.title8} content={data.para4} />}

      {/* Arrangement */}
      {data.arrangement && (
        <SectionCard>
          <h2>Arrangement</h2>
          <pre>{data.arrangement}</pre>
        </SectionCard>
      )}

      {/* Types / List */}
      {data.title3 && data.types?.length > 0 && (
        <SectionCard>
          <h2>{data.title3}</h2>
          {data.types.map((type, idx) => (
            <div key={idx}>
              <h3>{type.name}</h3>
              <ul>
                {type.operation.map((op, i) => <li key={i}>{op}</li>)}
              </ul>
            </div>
          ))}
        </SectionCard>
      )}

      {/* Pin Configurations */}
      {data.title4 && data.configurations?.length > 0 && (
        <SectionCard>
          <h2>{data.title4}</h2>
          {data.configurations.map((config, idx) => (
            <div key={idx} className="mb-4">
              {config.name && <h3>{config.name}</h3>}
              {config.operation?.length > 0 && (
                <ul>
                  {config.operation.map((op, i) => <li key={i}>{op}</li>)}
                </ul>
              )}
            </div>
          ))}
        </SectionCard>
      )}

      {/* Diagram Image */}
      {data.image2 && (
        <Image
          src={data.image2}
          height={500}
          width={540}
          alt={`${data.mainTitle || "Experiment"} diagram`}
        />
      )}

      {/* Components Required */}
      {data.title9 && data.Components?.length > 0 && (
        <SectionCard>
          <h2>{data.title9}</h2>
          <ul>
            {data.Components.map((comp, idx) => <li key={idx}>{comp}</li>)}
          </ul>
        </SectionCard>
      )}

      {/* Circuit Connections */}
      {data.title10 && data.CircuitConnections?.length > 0 && (
        <SectionCard>
          <h2>{data.title10}</h2>
          {data.CircuitConnections.map((circuit, idx) => (
            <div key={idx} className="mb-4">
              {circuit.name && <h3>{circuit.name}</h3>}
              {circuit.operation?.length > 0 && (
                <ul>
                  {circuit.operation.map((step, i) => <li key={i}>{step}</li>)}
                </ul>
              )}
            </div>
          ))}
        </SectionCard>
      )}

      {/* Circuit Image */}
      {data.image3 && (
        <Image
          src={data.image3}
          height={600}
          width={740}
          alt={`${data.mainTitle || "Experiment"} circuit`}
        />
      )}

      {/* Algorithm */}
      {data.algorithms?.length > 0 && (
        <SectionCard>
          <h2>Algorithm</h2>
          <ol>
            {data.algorithms.map((algo, idx) => {
              const stepKey = `step${idx + 1}`;
              return (
                <li key={idx} className="mb-4">
                  {algo[stepKey] && <h3>{algo[stepKey]}</h3>}
                  {algo.operation?.length > 0 && (
                    <ul>
                      {algo.operation.map((op, i) => <li key={i}>{op}</li>)}
                    </ul>
                  )}
                </li>
              );
            })}
          </ol>
        </SectionCard>
      )}

      {/* Arduino Code */}
      {data.code && (
        <SectionCard>
          <h3 id="Code">Arduino Code</h3>
          <CodeBox code={data.code.replace(/\\n/g, "\n")} language="cpp" />
        </SectionCard>
      )}

      {/* Applications */}
      {data.applications?.length > 0 && (
        <SectionCard>
          <h2>Applications</h2>
          <ul>
            {data.applications.map((app, idx) => <li key={idx}>{app}</li>)}
          </ul>
        </SectionCard>
      )}

      {/* Conclusion */}
      {data.conclusion && (
        <SectionCard>
          <h2>Conclusion</h2>
          <p>{data.conclusion}</p>
        </SectionCard>
      )}
    </div>
  );
}

// Reusable card wrapper — replaces repeated inline section styles
function SectionCard({ children }) {
  return (
    <section className="mb-4 p-5 rounded-xl border border-border bg-muted/30 dark:bg-muted/10 shadow-sm transition-colors">
      {children}
    </section>
  );
}

// Simple title + paragraph section
function Section({ title, content }) {
  return (
    <SectionCard>
      <h2>{title}</h2>
      <p>{content}</p>
    </SectionCard>
  );
}