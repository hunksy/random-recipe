import asyncio
from aiogram import Bot, Dispatcher, types
from aiogram.filters.command import Command
from aiogram.types.web_app_info import WebAppInfo

TOKEN = '7215489064:AAHuMJ75OUpxSRtudQJYInuLZzMDR0p0KYg'
WEBSITE = 'https://127.0.0.1:8080/'

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