export async function translate(text) {
  const url = 'https://translate-plus.p.rapidapi.com/translate';
  const options = {
    method: 'POST',
    headers: {
      'x-rapidapi-key': 'c083d89f6dmsh00789b783d7213fp15d6c3jsnabb98d1061b1',
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
