import telegraf, { Context, Telegraf } from 'telegraf';
import dotenv from 'dotenv'
import { Update } from 'telegraf/typings/core/types/typegram';

dotenv.config();

const bot: Telegraf<Context<Update>> = new Telegraf<Context<Update>>(process.env.TELEGRAM_API_TOKEN as string);
const port = process.env.PORT;

