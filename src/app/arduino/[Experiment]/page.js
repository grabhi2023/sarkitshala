import { notFound } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import getData from '@/app/apiCall';
import PostView from '@/components/blog/PostView';
import PIRSensorTutorial from '@/components/pir';
import {
  getLegacy,
  getPublishedSlugs,
  legacySlugs,
  loadPost,
  pageMetadata,
  postMetadata,
  truncate,
} from '@/lib/blogPage';

const CodeBox = dynamic(() => import('@/components/code.jsx'));
const AllCom = dynamic(() => import('@/components/AllCom'));
const LEDArduino = dynamic(() => import('@/components/Led'));

const API = 'https://sarkitshala.com/api/experiments/Arduino';
const META_API = 'https://sarkitshala.com/api/experiments/ArduinoMeta';
const DEFAULT_DESCRIPTION =
  'Learn Arduino interfacing step by step. Explore various Arduino experiments and tutorials with detailed guides.';

const ALL_COM_IDS = new Set(['9', '11', ...Array.from({ length: 111 }, (_, i) => String(i + 15))]);

export async function generateStaticParams() {
  const [legacy, posts] = await Promise.all([
    getData(API)
      .then(legacySlugs)
      .catch((error) => {
        console.error('arduino static params failed:', error.message);
        return [];
      }),
    getPublishedSlugs('arduino'),
  ]);

  return [...new Set([...legacy, ...posts])].map((Experiment) => ({ Experiment }));
}

export async function generateMetadata({ params }) {
  const { Experiment } = await params;

  const post = await loadPost('arduino', Experiment);
  if (post) return postMetadata(post, 'arduino');

  const data = await getLegacy(() => getData(META_API, Experiment));
  if (!data) notFound();

  const title = data.title || 'Arduino Experiment';
  return pageMetadata({
    category: 'arduino',
    slug: Experiment,
    title: `${title} | Sarkitshala`,
    ogTitle: `${title} | Arduino Projects & Tutorials`,
    description: truncate(data.metaDescription || DEFAULT_DESCRIPTION),
    image: data.image1,
  });
}

export default async function Page({ params }) {
  const { Experiment } = await params;

  const post = await loadPost('arduino', Experiment);
  if (post) return <PostView post={post} />;

  if (Experiment === 'interfacing-pir-sensor') return <PIRSensorTutorial />;

  const data = await getLegacy(() => getData(API, Experiment));
  if (!data) notFound();

  const id = String(data.ExperimentId ?? '');

  if (id === '1') return <LEDArduino data={data} />;
  if (ALL_COM_IDS.has(id)) return <AllCom data={data} />;

  return <LegacyArduinoPage data={data} id={id} />;
}

function LegacyArduinoPage({ data, id }) {
  const compact = id === '4' || id === '5';
  const name = data.ExperimentName;
  const sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px';
  const box = 'mb-3 p-4 rounded-lg border border-gray-300 shadow-sm';

  return (
    <div className="articleContainer">
      <h1>{name}</h1>

      {data.image1 && (
        <Image
          src={data.image1}
          alt={`${name} - Experiment Image`}
          width={compact ? 300 : 500}
          height={compact ? 200 : 400}
          sizes={sizes}
          className="md:ml-28 mt-4 md:rounded"
        />
      )}

      <h2>{data.madeBy}</h2>
      <p>{data.madeByinfo}</p>
      {data.madeByinfo1 && <p id="introduction" className={box}>{data.madeByinfo1}</p>}
      {data.madeByinfo2 && <p id="introduction-2" className={box}>{data.madeByinfo2}</p>}

      <div className={box}>
        <h2 id="Overview">{data.overview}</h2>
        <p>
          {data.overviewinfo1}
          <br />
          {data.overviewinfo2}
        </p>
      </div>

      {data.image2 && (
        <div>
          <Image
            src={data.image2}
            alt={`${name} - Specifications`}
            width={500}
            height={440}
            sizes={sizes}
            className="w-full h-full md:ml-4"
          />
        </div>
      )}

      <div className={box}>
        <h2 id="Pin-Diagram">{data.pinDiagramInfo}</h2>
        {data.image3 && (
          <Image
            src={data.image3}
            alt={`${name} - Pin Diagram`}
            width={450}
            height={300}
            sizes={sizes}
            className="md:ml-28"
          />
        )}
      </div>

      <div className={box}>
        <h2 id="Circuit-Diagram">{data.CircuitDiagramInfo}</h2>
        {data.image4 && (
          <Image
            src={data.image4}
            alt={`${name} - Circuit Diagram`}
            width={500}
            height={400}
            sizes={sizes}
            className="md:ml-20"
          />
        )}
      </div>

      {id !== '14' && (
        <div className={box}>
          <h3 id="Steps">Steps</h3>
          {data.step && <p className="mt-4">{data.step}</p>}
          {[1, 2, 3, 4, 5, 6].map(
            (n) =>
              data[`step${n}`] && (
                <p key={n} className="mt-4">
                  {n}. {data[`step${n}`]}
                </p>
              )
          )}
        </div>
      )}

      <div className={box}>
        <h3 id="Code">Code</h3>
        <CodeBox num={data.ExperimentId} exNam="ard" language="c" />
      </div>

      <div className={box}>
        <h3 id="Conclusion">Conclusion</h3>
        <p>{data.result}</p>
      </div>
    </div>
  );
}