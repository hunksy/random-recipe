export async function getRandomMeal() {
    console.log("Отправка запроса к API...");
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    console.log("Ответ получен:", response);

    if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
    } else {
        return response.json(); 
    }
}

export async function getMealById(id) {
    console.log("Отправка запроса к API...");
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    console.log("Ответ получен:", response);

    if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
    } else {
       return response.json(); 
    }
}
