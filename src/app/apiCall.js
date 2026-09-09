export default async function getData(url, exNum) {
  const requestUrl = exNum && exNum.trim() !== ''
    ? `${url}?exId=${encodeURIComponent(exNum)}`
    : url;

  const response = await fetch(requestUrl, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store', // ya revalidate set karo, apne hisab se
  });

  const text = await response.text();

  if (!response.ok) {
    console.error(`API failed [${response.status}] for ${requestUrl}:`, text.slice(0, 200));
    throw new Error(`API error ${response.status}: ${text.slice(0, 200)}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    console.error('Non-JSON response:', text.slice(0, 200));
    throw new Error('Server did not return JSON');
  }
}