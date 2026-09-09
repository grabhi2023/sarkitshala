export default async function getData(url, exNum) {
  try {
   
    const requestUrl = exNum && exNum.trim() !== '' 
      ? `${url}?exId=${encodeURIComponent(exNum)}`
      : url;

    
    console.log('Request URL:', requestUrl);

    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

   

    return await response.json();
    
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error; 
  }
}
