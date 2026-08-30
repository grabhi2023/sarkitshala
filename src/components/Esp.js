import dynamic from "next/dynamic";
import   '../app/globals.css'
const CodeBox = dynamic(() => import('@/components/code.jsx'));

export default function Esp({ data }) {
  return (
    <div className="articleContainer   mt-12 md:mt-8    w-[90%] md:ml-2">
      <main>
      <h1 >{data.mainTitle}</h1>

      {/* Title 1 - Introduction */}
      {data.title1 && (
        <section className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">
          <h2 >{data.title1}</h2>
          <p>{data.para1}</p>
        </section>
      )}

      {/* Title 2 - Working Principle */}
      {data.title2 && (
        <section className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">
          <h2 >{data.title2}</h2>
          <p>{data.para2}</p>

          {/* Working Steps */}
          {data.workingSteps?.length > 0 && (
            <ul className="list-decimal pl-6 mt-4">
              {data.workingSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          )}

          {/* Formula */}
          {data.formula && (
            <p >Formula: {data.formula}</p>
          )}
        </section>
      )}

      {/* Title 3 - Components Required */}
      {data.title3 && data.components?.length > 0 && (
        <section className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">
          <h2 >{data.title3}</h2>
          <ul className="list-disc pl-6">
            {data.components.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {data.title4 && data.pinConfig?.length > 0 && (
        <section className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">
          <h2 >{data.title4}</h2>
          <ul className="list-disc pl-6">
            {data.pinConfig.map((item, idx) => (
              <li key={idx}>
                <span className="font-semibold">{item.pin}</span>: {item.description}
              </li>
            ))}
          </ul>
          {data.note && <p className="mt-4 italic text-sm text-gray-700">{data.note}</p>}
        </section>
      )}

      {/* Title 5 - Wiring */}
      {data.title5 && data.wiring?.length > 0 && (
        <section className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">
          <h2 >{data.title5}</h2>
          <ul className="list-decimal pl-6">
            {data.wiring.map((item, idx) => (
              <li key={idx}>
                <span className="font-semibold">{item.sensorPin}</span> {'->'} {item.esp32Pin}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Title 6 - Arduino Code */}
      {data.title6 && data.code && (
        <section className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">
          <h2>{data.title6}</h2>
          {data.code && 
            <CodeBox code={data.code.replace(/\\n/g, '\n')} language={'cpp'} />
          }
        </section>
      )}

      {/* Title 7 - Code Explanation */}
      {data.title7 && data.codeExplanation?.length > 0 && (
        <section className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">
          <h2 >{data.title7}</h2>
          <ul className="list-decimal pl-6">
            {data.codeExplanation.map((item, idx) => (
              <li key={idx}>
                <span className="font-semibold">{item.line}</span>: {item.explanation}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Title 8 - Applications */}
      {data.title8 && data.applications?.length > 0 && (
        <section className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">
          <h2 >{data.title8}</h2>
          <ul className="list-disc pl-6">
            {data.applications.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Title 9 - Conclusion */}
      {data.title9 && data.conclusion && (
        <section className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">
          <h2 >{data.title9}</h2>
          <p>{data.conclusion}</p>
        </section>
      )}
      </main>
    </div>
  );
}
