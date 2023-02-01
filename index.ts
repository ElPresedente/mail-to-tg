import telegraf, { Context, Telegraf } from 'telegraf';
import dotenv from 'dotenv'
import { Update } from 'telegraf/typings/core/types/typegram';
import getLastMails from './commands/get-last-mail'
dotenv.config();

const bot: Telegraf<Context<Update>> = new Telegraf<Context<Update>>(process.env.TELEGRAM_API_TOKEN as string);
const port = process.env.PORT;

bot.hears('hi', (ctx) => ctx.reply('Hey there'));

bot.command('get-last-mails', getLastMails)



bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));