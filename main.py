import asyncio
from aiogram import Bot, Dispatcher, types
from aiogram.filters.command import Command
from aiogram.types.web_app_info import WebAppInfo

TOKEN = '7215489064:AAHuMJ75OUpxSRtudQJYInuLZzMDR0p0KYg'

bot = Bot(TOKEN)

dp = Dispatcher()

@dp.message(Command('start'))
async def start(message: types.message):
    kb = [
        [types.KeyboardButton(text='Открыть', web_app=WebAppInfo(url='https://google.com'))]
    ]
    markup = types.ReplyKeyboardMarkup(keyboard=kb)
    await message.answer('Привет', reply_markup=markup)

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())