export async function translate(text) {
  const url = 'https://translate-plus.p.rapidapi.com/translate';
  const options = {
    method: 'POST',
    headers: {
      'x-rapidapi-key': 'ddd74eaddfmsh283f64f28674197p18bad3jsn5572d18eaa05',
      'x-rapidapi-host': 'translate-plus.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: `${text}`,
      source: 'en',
      target: 'ru'
    })
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result['translations']['translation']);
    return result['translations']['translation'];
  } catch (error) {
    console.error(error);
  }
}
