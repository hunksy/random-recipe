import {translate} from './translate.js'
import { getRandomMeal } from './api.js';

document.querySelector(".getRec").addEventListener("click", async function () {

    var addRecButton = document.querySelector('.addRec');
    addRecButton.style.display = 'block'; 
    var addRecTable = document.querySelector('.recTable');
    addRecTable.style.display = 'block'; 

    try {
        const data = await getRandomMeal();
        console.log("Полученные данные:", data);

        if (!data.meals) {
            alert("Ошибка загрузки рецепта! Данные пустые.");
            return;
        }

        const favoritesContainer = document.querySelector(".favoritesList");    
        favoritesContainer.innerHTML = "";

        const meal = data.meals[0];

        document.querySelector(".recImage").src = meal.strMealThumb;
        document.querySelector(".recName").textContent = meal.strMeal;
        document.querySelector(".recCategory").textContent = meal.strCategory;
        document.querySelector(".recInstruction").textContent = meal.strInstructions;
        document.querySelector(".addRec").setAttribute("data-recipe-id", meal.idMeal);

        const tableBody = document.querySelector(".recTableBody");
        tableBody.innerHTML = "";

        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];

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

    const favoritesContainer = document.querySelector(".favoritesList");
    favoritesContainer.innerHTML = "";

    try {
        const response = await fetch(`/api/favorites/random?user_id=${userId}`);
        const result = await response.json();

        if (!result.success) {
            alert("Нет избранных рецептов!");
            return;
        }

        const meal = result.recipe.meals[0];
        document.querySelector(".recImage").src = meal.strMealThumb;
        document.querySelector(".recName").textContent = meal.strMeal;
        document.querySelector(".recCategory").textContent = meal.strCategory;
        document.querySelector(".recInstruction").textContent = meal.strInstructions;
        document.querySelector(".addRec").setAttribute("data-recipe-id", meal.idMeal);

        const tableBody = document.querySelector(".recTableBody");
        tableBody.innerHTML = "";

        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];

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

async function removeRecipe(userId, recipeId) {
    try {
        const response = await fetch('/api/favorites/remove', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, recipe_id: recipeId })
        });

        const result = await response.json();
        if (result.success) {
            console.log("Рецепт удален:", recipeId);
        } else {
            console.error("Ошибка при удалении рецепта:", result.message);
        }
    } catch (error) {
        console.error("Ошибка при запросе на удаление:", error);
    }
}

document.querySelector(".showFavoritesBtn").addEventListener("click", async () => {

    const recipe = document.querySelector(".recipe");    
    recipe.innerHTML = "";

    try {
        let tg = window.Telegram.WebApp;
        let userId = tg.initDataUnsafe.user.id; 
        const response = await fetch(`/api/favorites/all?user_id=${userId}`);
        const result = await response.json();

        const favoritesContainer = document.querySelector(".favoritesList");
        favoritesContainer.innerHTML = ""; 

        if (!result.success) {
            favoritesContainer.innerHTML = "<p>Нет избранных рецептов!</p>";
            return;
        }

        result.recipes.forEach((meal) => {
            const mealDiv = document.createElement("div");
            mealDiv.classList.add("favorite-item");
        
            mealDiv.innerHTML = `
                <img class="recImage" src="${meal.strMealThumb}" alt="Изображение рецепта">
                <h3 class="recName">${meal.strMeal}</h3>
                <p class="recCategory">${meal.strCategory}</p>
                <p class="recInstruction">${meal.strInstructions}</p>
                <button class="removeRec" data-recipe-id="${meal.idMeal}">Удалить</button>
            `;
        
            console.log("Добавляем рецепт:", mealDiv);
            favoritesContainer.appendChild(mealDiv);
            mealDiv.querySelector(".removeRec").addEventListener("click", async (event) => {
                const recipeId = event.target.dataset.recipeId;
                await removeRecipe(userId, recipeId);
                mealDiv.remove();
            });
        });

    } catch (error) {
        console.error("Ошибка при загрузке избранных рецептов:", error);
        alert(`Ошибка при загрузке рецептов! Проверь консоль:`, error.message);
    }
});