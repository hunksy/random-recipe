import dotenv from 'dotenv';
dotenv.config(({path: '../config/.env'}));

export async function translate(text) {
  const url = 'https://translate-plus.p.rapidapi.com/translate';
  const options = {
    method: 'POST',
    headers: {
      'x-rapidapi-key': `${process.env.TRANSLATE_API}`,
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
    return result['translations']['translation'];
  } catch (error) {
    console.error(error);
  }
}
