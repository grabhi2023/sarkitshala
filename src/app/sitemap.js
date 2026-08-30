export default async function sitemap() {
  try {
    const categories = [
      { key: 'Arduino', basePath: 'arduino', priority: 0.9 },
      { key: 'Res', basePath: 'raspberry', priority: 0.9 },
      { key: 'Esp', basePath: 'esp', priority: 0.8 }
    ];

    const fetchCategoryUrls = async ({ key, basePath, priority }) => {
      const res = await fetch(`https://sarkitshala.com/api/experiments/${key}`, {
        next: { revalidate: 3600 } 
      });
      const data = res.ok ? await res.json() : [];
      return data.map(({ slug, updatedAt }) => ({
        url: `https://sarkitshala.com/${basePath}/${slug}`,
        priority,
        changeFrequency: 'weekly',
        lastModified: updatedAt || new Date().toISOString()
      }));
    };

    const allCategoryUrls = await Promise.all(categories.map(fetchCategoryUrls));

    return [
     
      ...categories.map(c => ({
        url: `https://sarkitshala.com/${c.basePath}`,
        changeFrequency: 'weekly',
        priority: 1,
        lastModified: new Date().toISOString()
      })),
     
      ...allCategoryUrls.flat(),
      
      {
        url: `https://sarkitshala.com/about`,
        changeFrequency: 'monthly',
        priority: 0.7,
        lastModified: new Date().toISOString()
      },
      {
        url: `https://sarkitshala.com/jetson`,
        changeFrequency: 'monthly',
        priority: 0.7,
        lastModified: new Date().toISOString()
      }
    ];

  } catch (error) {
    console.error("Sitemap generation failed:", error);
    return [];
  }
}
