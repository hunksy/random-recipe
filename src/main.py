import asyncio
from aiogram import Bot, Dispatcher, types
from aiogram.filters.command import Command
from aiogram.types.web_app_info import WebAppInfo
import os
from dotenv import load_dotenv

dotenv_path = 'config/.env'
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

WEBSITE = 'https://127.0.0.1:8080/'
TOKEN = os.getenv("TOKEN")

bot = Bot(TOKEN)

dp = Dispatcher()

@dp.message(Command('start'))
async def start(message: types.message):
    kb = [
        [types.InlineKeyboardButton(text='Открыть приложение', web_app=WebAppInfo(url=WEBSITE))]
    ]
    markup = types.InlineKeyboardMarkup(inline_keyboard=kb)
    await message.answer(f'Привет, {message.from_user.first_name}! Это приложение случайных рецепт, для продолжения нажми кнопку "Открыть приложение".', reply_markup=markup)

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())