import requests

r = requests.get("https://www.themealdb.com/api/json/v1/1/random.php")
print(r.json()['meals'][0]['strMeal'])
