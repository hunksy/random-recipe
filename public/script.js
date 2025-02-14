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
        document.querySelector(".recName").textContent = meal.strMeal;
        document.querySelector(".recCategory").textContent = meal.strCategory;
        document.querySelector(".recInstruction").textContent = meal.strInstructions;

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