
import getData from "@/app/apiCall";
import Image from "next/image";
import dynamic from "next/dynamic";
import PIRSensorTutorial from "@/components/pir";
const CodeBox = dynamic(() => import('@/components/code.jsx'));
const AllCom = dynamic(() => import('@/components/AllCom'))
const LEDArduino =dynamic(()=>import('@/components/Led'))

// app/arduino/[Experiment]/page.js

export async function generateStaticParams() {
  try {
    // Pehle poora response dekho
    const response = await getData('https://sarkitshala.com/api/experiments/Arduino');
    
    // 🔍 DEBUG: Console mein poora response print karo
   
    
    // Case 1: Agar response direct array hai
    if (Array.isArray(response)) {
     
      return response.map((item) => {
       
        return {
          Experiment: String(item.slug || item.Experiment || item.id || item._id), // Multiple fallback
        };
      });
    }
    
    // Case 2: Agar response mein 'experiments' property hai
    if (response?.experiments && Array.isArray(response.experiments)) {
      console.log('✅ Response has experiments array with length:', response.experiments.length);
      return response.experiments.map((item) => ({
        Experiment: String(item.slug || item.Experiment),
      }));
    }
    
    // Case 3: Agar response mein 'data' property hai
    if (response?.data && Array.isArray(response.data)) {
      console.log('✅ Response has data array');
      return response.data.map((item) => ({
        Experiment: String(item.slug || item.Experiment),
      }));
    }
    
    console.log('❌ Unexpected response structure:', response);
    return [];
    
  } catch (error) {
    console.error('❌ Error in generateStaticParams:', error);
    return [];
  }
}
export async function generateMetadata({ params }) {
  // params ko await karein
  const { Experiment } = await params; // Destructure karein
  
  // Ab Experiment use karein
  const ExperimentData = await getData(
    `https://sarkitshala.com/api/experiments/ArduinoMeta`, 
    Experiment
  );

  const experimentTitle = ExperimentData.title || "Arduino Experiment";
  const experimentOverview = ExperimentData.metaDescription || "Learn Arduino interfacing step by step. Explore various Arduino experiments and tutorials with detailed guides.";
  const experimentImage = ExperimentData.image1 || 'https://sarkitshala.com/opengraph-image.jpg';
  const experimentSlug = `https://sarkitshala.com/arduino/${Experiment}`;
  const metadataBase = new URL('https://sarkitshala.com');
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: experimentTitle,
    description: experimentOverview,
    author: {
      "@type": "Organization",
      name: "Sarkitshala Team"
    },
    publisher: {
      "@type": "Organization",
      name: "Sarkitshala",
      logo: {
        "@type": "ImageObject",
        url: "https://sarkitshala.com/logo.jpg"
      }
    },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    image: experimentImage
  };

  return {
    metadataBase,
    title: `${experimentTitle} | Sarkitshala`,
    description: experimentOverview,
    robots: {
      index: true,
      follow: true,
    },
    url: experimentSlug,
    siteName: "Sarkitshala",
    openGraph: {
      title: `${experimentTitle} | Arduino Projects & Tutorials`,
      description: experimentOverview,
      url: experimentSlug,
      images: [
        {
          url: experimentImage,
          width: 1200,
          height: 630,
          alt: `${experimentTitle} Experiment preview`
        }
      ],
      site_name: "Sarkitshala",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${experimentTitle} | Arduino Guide`,
      description: experimentOverview,
      images: [experimentImage]
    },
    canonical: experimentSlug,
    alternates: {
      canonical: experimentSlug,
      languages: {
        "en-US": `https://sarkitshala.com/en/arduino/${Experiment}`,
        "hi-IN": `https://sarkitshala.com/hi/arduino/${Experiment}`
      }
    },
    author: "Sarkitshala Team (Amarjeet Singh Chauhan, Abhishek Kumar, Aman Raj)",
    structuredData: JSON.stringify(structuredData), 
  };
}






  



export default async function Page({ params }) {

  const { Experiment } = await params; 
console.log('exuuri is',Experiment)
 
  const data = await getData(`https://sarkitshala.com/api/experiments/Arduino`, Experiment);
 
  if(data.ExperimentId == 1)
    {
    
      return(<LEDArduino data={data} />)
    
    }
    if(Experiment == 'interfacing-pir-sensor')
    {
       return (<PIRSensorTutorial></PIRSensorTutorial>)
    }
    
if(data['ExperimentId'] == '9' || data['ExperimentId'] == '11' || data['ExperimentId'] == '15' || data['ExperimentId']=='16' || data['ExperimentId']=='17' || data['ExperimentId']=='18' || data['ExperimentId']=='19'  || data['ExperimentId']=='20' || data['ExperimentId']=='21' 
  || data['ExperimentId'] == '22' || data['ExperimentId'] == '23' || data['ExperimentId'] == '24' || data['ExperimentId'] == '25' || data['ExperimentId'] == '26' || data['ExperimentId'] == '27' || data['ExperimentId'] == '28'
  || data['ExperimentId'] == '29' || data['ExperimentId'] == '30' || data['ExperimentId'] == '31' || data['ExperimentId'] == '32' || data['ExperimentId'] == '33' ||
  data['ExperimentId'] == '34' || data['ExperimentId'] == '35' || data['ExperimentId'] == '36' || data['ExperimentId'] == '37' || data['ExperimentId'] == '38' || data['ExperimentId'] == '39'
  || data['ExperimentId'] == '40'|| data['ExperimentId'] == '41'|| data['ExperimentId'] == '42'|| data['ExperimentId'] == '43'|| data['ExperimentId'] == '44'|| data['ExperimentId'] == '45'
  || data['ExperimentId'] == '46'|| data['ExperimentId'] == '47'|| data['ExperimentId'] == '48'|| data['ExperimentId'] == '49'|| data['ExperimentId'] == '50'|| data['ExperimentId'] == '51'
  || data['ExperimentId'] == '52'|| data['ExperimentId'] == '53'|| data['ExperimentId'] == '54'|| data['ExperimentId'] == '55'|| data['ExperimentId'] == '56'|| data['ExperimentId'] == '57'
  || data['ExperimentId'] == '58'|| data['ExperimentId'] == '59'|| data['ExperimentId'] == '60'|| data['ExperimentId'] == '61'|| data['ExperimentId'] == '62'|| data['ExperimentId'] == '63'
  || data['ExperimentId'] == '64'|| data['ExperimentId'] == '65'|| data['ExperimentId'] == '66'|| data['ExperimentId'] == '67'|| data['ExperimentId'] == '68'|| data['ExperimentId'] == '69'
  || data['ExperimentId'] == '70'|| data['ExperimentId'] == '71'|| data['ExperimentId'] == '72'|| data['ExperimentId'] == '73'|| data['ExperimentId'] == '74'|| data['ExperimentId'] == '75'
  || data['ExperimentId'] == '76' || data['ExperimentId'] == '77' || data['ExperimentId'] == '78' || data['ExperimentId'] == '79' || data['ExperimentId'] == '80' || data['ExperimentId'] == '81'
  || data['ExperimentId'] == '82'|| data['ExperimentId'] == '83'|| data['ExperimentId'] == '84'|| data['ExperimentId'] == '85'|| data['ExperimentId'] == '86'|| data['ExperimentId'] == '87'|| data['ExperimentId'] == '88'
  || data['ExperimentId'] == '89'|| data['ExperimentId'] == '90'|| data['ExperimentId'] == '91'|| data['ExperimentId'] == '92'|| data['ExperimentId'] == '93'|| data['ExperimentId'] == '94'
  || data['ExperimentId'] == '95'|| data['ExperimentId'] == '96'|| data['ExperimentId'] == '97'|| data['ExperimentId'] == '98'|| data['ExperimentId'] == '99'|| data['ExperimentId'] == '100'
  || data['ExperimentId'] == '101'|| data['ExperimentId'] == '102'|| data['ExperimentId'] == '103'|| data['ExperimentId'] == '104'|| data['ExperimentId'] == '105'|| data['ExperimentId'] == '106'
  || data['ExperimentId'] == '107'|| data['ExperimentId'] == '108'|| data['ExperimentId'] == '109'|| data['ExperimentId'] == '110'|| data['ExperimentId'] == '111'|| data['ExperimentId'] == '112'
  || data['ExperimentId'] == '113'|| data['ExperimentId'] == '114'|| data['ExperimentId'] == '115'|| data['ExperimentId'] == '116'|| data['ExperimentId'] == '117'|| data['ExperimentId'] == '118'
  || data['ExperimentId'] == '119'|| data['ExperimentId'] == '120'|| data['ExperimentId'] == '121'|| data['ExperimentId'] == '122'|| data['ExperimentId'] == '123'|| data['ExperimentId'] == '124'
  || data['ExperimentId'] == '125')
{

  return(<AllCom  data={data}/>)

}


  return (
    <>
  
    <div className="articleContainer ">

    
        <h1>{data.ExperimentName}</h1>

        <Image

  src={data.image1}
  alt={`${data.ExperimentName} - Experiment Image`}
  width={data.ExperimentId === '5' || data.ExperimentId === '4' ? 300 : 500}
  height={data.ExperimentId === '5' || data.ExperimentId === '4' ? 200 : 400}
   sizes="(max-width: 768px) 100vw, (max-width: 100px) 50vw, 500px "
 className="   md:ml-28 mt-4 md:rounded "
/>
        <h2 >{data.madeBy}</h2>
        <p>{data.madeByinfo}</p>
        <p  id="introduction" className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">{data.madeByinfo1}</p>
         <p  id="introduction" className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">{data.madeByinfo2}</p>

        <p className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">
        <h2  id="Overview" >{data.overview}</h2>{data.overviewinfo1}<br/>{data.overviewinfo2}</p>

        <div >
        <Image
            width={500}
            height={440}
            
             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px "
            className="   w-full h-full md:ml-4"
            src={data.image2} 
            alt={`${data.ExperimentName} - Specifications `}
          />
        
        </div>

          <div>
          <div className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">
          <h2  id="Pin-Diagram">
            {data.pinDiagramInfo}
          </h2>
            <Image height={300} width={450}  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px " src={data.image3} className="md:ml-28" alt={`${data.ExperimentName} -  Pin Diagram `}/>
          </div>

          
          <div className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">
          <h2  id="Circuit-Diagram">
            {data.CircuitDiagramInfo}</h2>
            <Image  height={400} width={500}  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px " className="md:ml-20" src={data.image4} alt={`${data.ExperimentName} - Circuit Diagram`} />
          </div>
        </div>

       
     
  {data.ExperimentId !== '14' && (
  <div className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">
    <h3  id="Steps">Steps</h3>
    {data.step && <p className="mt-4">{data.step}</p>}
    {data.step1 && <p className="mt-4">1. {data.step1}</p>}
    {data.step2 && <p className="mt-4">2. {data.step2}</p>}
    {data.step3 && <p className="mt-4">3. {data.step3}</p>}
    {data.step4 && <p className="mt-4">4. {data.step4}</p>}
    {data.step5 && <p className="mt-4">5. {data.step5}</p>}
    {data.step6 && <p className="mt-4">6. {data.step6}</p>}
  </div>
)}

        <p className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">
        <h3  id="Code">Code</h3>
        <CodeBox num={data.ExperimentId} exNam="ard" language={'c'} /></p>

      
        
        <p className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">
        <h3  id="Conclusion">Conclusion</h3>
        {data.result}</p>
    
    </div>

  </>

  );
}
