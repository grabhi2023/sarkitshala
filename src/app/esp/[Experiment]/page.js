




import getData from "@/app/apiCall";

import Esp from "@/components/Esp";
export async function generateStaticParams() {
  try {
    // API direct array return karta hai (response?.experiments nahi)
    const response = await getData('https://sarkitshala.com/api/experiments/Esp');
    
    // Debug: Check actual response structure
    console.log('ESP API Response:', response);
    
    // Agar response array hai
    if (Array.isArray(response)) {
      return response.map((post) => ({
        Experiment: String(post.slug), // ⚠️ 'ExperimentId' nahi, 'Experiment' use karo
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  // ⚠️ Next.js 15: params ko await karna mandatory hai
  const { Experiment } = await params;
  
  
  try {
    // API call with exId
    const data = await getData(
      `https://sarkitshala.com/api/experiments/Esp`, 
      Experiment  // ye exId ke roop me jayega
    );

    if (!data?.title) {
      throw new Error("Invalid metadata structure");
    }

    const desc = data.metaDescription || "Discover ESP32 experiments and projects.";
    
    // SEO description generator
    const generateSeoDescription = (text, maxLength = 160) => {
      if (!text) return "Discover ESP32 projects on Sarkitshala.";
      const truncated = text.length > maxLength
        ? `${text.slice(0, text.lastIndexOf(' ', maxLength)).trim()}...`
        : text.trim();
      return `${truncated} Discover ESP32 projects on Sarkitshala.`;
    };

    return {
      title: `${data.title} | ESP32 Tutorial - Sarkitshala`,
      description: generateSeoDescription(desc),
      robots: { index: true, follow: true },
      
      openGraph: {
        title: `${data.title} | ESP32 Project Guide`,
        description: generateSeoDescription(desc),
        url: `https://sarkitshala.com/esp/${Experiment}`,
        images: [
          {
            url: data.image1 || 'https://sarkitshala.com/opengraph-image.jpg',
            width: 1200,
            height: 630,
            alt: `${data.title} - ESP32 Project`
          }
        ],
        site_name: 'Sarkitshala',
        type: 'article',
      },
      
      twitter: {
        card: 'summary_large_image',
        title: `${data.title} - ESP32 Projects`,
        description: generateSeoDescription(desc),
        images: [data.image1 || 'https://sarkitshala.com/opengraph-image.jpg'],
      },
      
      canonical: `https://sarkitshala.com/esp/${Experiment}`,
      
      alternates: {
        canonical: `https://sarkitshala.com/esp/${Experiment}`,
        languages: {
          'en-US': `https://sarkitshala.com/en/esp/${Experiment}`,
          'hi-IN': `https://sarkitshala.com/hi/esp/${Experiment}`,
        },
      },
      
      authors: [{ name: 'Sarkitshala Team' }],
    };
    
  } catch (error) {
    console.error('ESP Metadata Error:', error.message);
    
    // Fallback metadata
    return {
      title: `ESP32 ${Experiment} Tutorial - Sarkitshala`,
      description: `Learn about ${Experiment} with ESP32. Step by step guide with code examples.`,
      robots: { index: true, follow: true },
      canonical: `https://sarkitshala.com/esp/${Experiment}`,
    };
  }
}




export default async function Page({ params }) {
  const { Experiment } =await params; 
  
  
  const data = await getData(`https://sarkitshala.com/api/experiments/Esp`, Experiment)
 

  return (
    <>
    <Esp data={data}/>
  </>
  );
}
