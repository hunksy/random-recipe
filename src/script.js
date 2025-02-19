import {translate} from './translate.js'

document.querySelector(".getRec").addEventListener("click", async function () {

    var addRecButton = document.querySelector('.addRec');
    addRecButton.style.display = 'block'; 
    var addRecTable = document.querySelector('.recTable');
    addRecTable.style.display = 'block'; 

    const apiUrl = "https://www.themealdb.com/api/json/v1/1/random.php";

    try {
        console.log("Отправка запроса к API...");

        const response = await fetch(apiUrl);
        console.log("Ответ получен:", response);

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("Полученные данные:", data);

        if (!data.meals) {
            alert("Ошибка загрузки рецепта! Данные пустые.");
            return;
        }

        const meal = data.meals[0];

        document.querySelector(".recImage").src = meal.strMealThumb;
        document.querySelector(".recName").textContent = await translate(meal.strMeal);
        document.querySelector(".recCategory").textContent = await translate(meal.strCategory);
        document.querySelector(".recInstruction").textContent = await translate(meal.strInstructions);
        document.querySelector(".addRec").setAttribute("data-recipe-id", meal.idMeal);

        const tableBody = document.querySelector(".recTableBody");
        tableBody.innerHTML = "";

        for (let i = 1; i <= 20; i++) {
            const ingredient = await translate(meal[`strIngredient${i}`]);
            const measure = await translate(meal[`strMeasure${i}`]);

            if (ingredient && ingredient.trim() !== "") {
                const row = document.createElement("tr");
                row.innerHTML = `<td>${ingredient}</td><td>${measure}</td>`;
                tableBody.appendChild(row);
            }
        }

    } catch (error) {
        console.error("Ошибка при загрузке рецепта:", error);
        alert("Ошибка при загрузке рецепта! Проверь консоль.");
    }
});

document.querySelector(".addRec").addEventListener("click", async function () {
    var addRecButton = document.querySelector('.addRec');
    addRecButton.style.display = 'none'; 

    let tg = window.Telegram.WebApp;
    let userId = tg.initDataUnsafe.user.id; 
    const recipeId = this.getAttribute("data-recipe-id");

    try {
        const response = await fetch('/api/favorites/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, recipe_id: recipeId })
        });

        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error("Ошибка при добавлении в избранное:", error);
    }
});

document.querySelector(".getRecFav").addEventListener("click", async function () {
    let tg = window.Telegram.WebApp;
    let userId = tg.initDataUnsafe.user.id; 

    var addRecButton = document.querySelector('.addRec');
    addRecButton.style.display = 'none'; 
    var addRecTable = document.querySelector('.recTable');
    addRecTable.style.display = 'block'; 

    try {
        const response = await fetch(`/api/favorites/random?user_id=${userId}`);
        const result = await response.json();

        if (!result.success) {
            alert("Нет избранных рецептов!");
            return;
        }

        const meal = result.recipe.meals[0];
        document.querySelector(".recImage").src = meal.strMealThumb;
        document.querySelector(".recName").textContent = await translate(meal.strMeal);
        document.querySelector(".recCategory").textContent = await translate(meal.strCategory);
        document.querySelector(".recInstruction").textContent = await translate(meal.strInstructions);
        document.querySelector(".addRec").setAttribute("data-recipe-id", meal.idMeal);

        const tableBody = document.querySelector(".recTableBody");
        tableBody.innerHTML = "";

        for (let i = 1; i <= 20; i++) {
            const ingredient = await translate(meal[`strIngredient${i}`]);
            const measure = await translate(meal[`strMeasure${i}`]);

            if (ingredient && ingredient.trim() !== "") {
                const row = document.createElement("tr");
                row.innerHTML = `<td>${ingredient}</td><td>${measure}</td>`;
                tableBody.appendChild(row);
            }
        }
    } catch (error) {
        console.error("Ошибка при получении избранного рецепта:", error);
    }
});
