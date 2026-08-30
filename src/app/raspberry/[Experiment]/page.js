


import getData from "@/app/apiCall";


export async function generateStaticParams() {
  try {
    const response = await getData('https://sarkitshala.com/api/experiments/Res');
    
    
    
    if (Array.isArray(response)) {
      return response.map((post) => ({
        Experiment: String(post.slug), // ⚠️ 'ExperimentId' nahi
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  // ⚠️ params await karo
  const { Experiment } = await params;
  
  let experimentData = {};
  
  try {
    // API call with exId
    experimentData = await getData(
      'https://sarkitshala.com/api/experiments/Res',
      Experiment
    );
    
   
    
  } catch (error) {
    console.error("Failed to fetch metadata:", error.message);
  }

  // Fallback values
  const experimentTitle = experimentData?.title || `${Experiment} - Raspberry Pi Tutorial`;
  const experimentOverview = experimentData?.description || 
    "Explore Raspberry Pi tutorials and projects step by step. Learn about interfacing sensors, displays, and other modules with Raspberry Pi.";
  const experimentImage = experimentData?.image1 || "https://sarkitshala.com/opengraph-image.jpg";
  const experimentSlug = `https://sarkitshala.com/raspberry/${Experiment}`;

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: experimentTitle,
    description: experimentOverview,
    author: {
      "@type": "Organization",
      name: "Sarkitshala Team",
    },
    publisher: {
      "@type": "Organization",
      name: "Sarkitshala",
      logo: {
        "@type": "ImageObject",
        url: "https://sarkitshala.com/logo.jpg",
      },
    },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    image: experimentImage,
  };

  return {
    metadataBase: new URL("https://sarkitshala.com"),
    title: `${experimentTitle} | Sarkitshala`,
    description: experimentOverview,
    
    robots: {
      index: true,
      follow: true,
    },
    
    openGraph: {
      title: experimentTitle,
      description: experimentOverview,
      url: experimentSlug,
      images: [
        {
          url: experimentImage,
          width: 1200,
          height: 630,
          alt: experimentTitle,
        }
      ],
      site_name: "Sarkitshala",
      type: "article",
    },
    
    twitter: {
      card: "summary_large_image",
      title: experimentTitle,
      description: experimentOverview,
      images: [experimentImage],
    },
    
    canonical: experimentSlug,
    
    alternates: {
      canonical: experimentSlug,
      languages: {
        "en-US": `https://sarkitshala.com/en/raspberry/${Experiment}`,
        "hi-IN": `https://sarkitshala.com/hi/raspberry/${Experiment}`,
      },
    },
    
    authors: [{ name: "Sarkitshala Team" }],
    
    // other metadata
    other: {
      "article:author": "Sarkitshala Team",
    },
    
    // Structured data ko stringify karo
    jsonLd: structuredData,
  };
}



export default async function Page({ params }) {
    const { Experiment } = await params; 
    
    const data = await getData(`https://sarkitshala.com/api/experiments/Res`, Experiment)
  
      if(data)
      {
        return (
    <div className="articleContainer ">
      
      <h1 >{data.title}</h1>

      <section className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">
        <p>{data.description}</p>
      </section>

      {data.sections.map((section, index) => (
        <section key={index}  className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">
          {section.heading && (
            <h2 className="text-xl font-bold mb-4">{section.heading}</h2>
          )}

          {section.content && <p>{section.content}</p>}

          {renderList(section.points)}
          {renderList(section.items)}
          {renderSteps(section.steps)}
          {renderCode(section.code)}

          {section.run_command && (
            <p className="mt-4">
              <strong>Run Command:</strong> <code>{section.run_command}</code>
            </p>
          )}

          {section.output && (
            <p className="mt-4" dangerouslySetInnerHTML={{ __html: section.output }} />
          )}

          {section.faqs && renderFAQs(section.faqs)}

          {section.links && (
            <ul className="mt-4">
              {section.links.map((link, i) => (
                <li key={i}>
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {section.subsections && section.subsections.map((sub, i) => (
            <div key={i} className="ml-5 mt-4 border-l-4 border-gray-300 pl-4">
              {sub.subheading && (
                <h4 className="text-lg font-semibold mb-2">{sub.subheading}</h4>
              )}

              {sub.content && <p>{sub.content}</p>}
              {renderList(sub.points)}
              {renderList(sub.items)}
              {renderSteps(sub.steps)}
              {renderCode(sub.code)}
              {renderCommands(sub.commands)}

              {sub.note && (
                <p className="mt-2"><strong>Note:</strong> {sub.note}</p>
              )}
            </div>
          ))}
        </section>
      ))}
    </div>
  );

        
      }
  
     
}
function renderList(items) {
  return items && (
    <ul className="list-disc pl-5 mb-2">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function renderSteps(steps) {
  return steps && (
    <ol className="list-decimal pl-5 mb-2">
      {steps.map((step, i) => (
        <li key={i}>{step}</li>
      ))}
    </ol>
  );
}

function renderCode(code) {
  return code && (
    <pre className="bg-gray-200 p-4 overflow-x-auto rounded font-mono text-sm border my-4">
      {code.map((line, i) => (
        <code key={i} className="block">{line}</code>
      ))}
    </pre>
  );
}

function renderCommands(commands) {
  return commands && (
    <pre className="bg-gray-100 p-4 overflow-x-auto rounded font-mono text-sm border my-4">
      {commands.map((cmd, i) => (
        <code key={i} className="block">{cmd}</code>
      ))}
    </pre>
  );
}

function renderFAQs(faqs) {
  return (
    <div className="mt-4">
      {faqs.map((faq, i) => (
        <div key={i} className="mb-3">
          <p><strong>Q:</strong> {faq.question}</p>
          <p><strong>A:</strong> {faq.answer}</p>
        </div>
      ))}
    </div>
  );
}
