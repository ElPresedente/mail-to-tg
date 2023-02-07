import { Telegraf } from 'telegraf';
import dotenv from 'dotenv'
import getLastMails from './commands/get-last-mail'
import MailReader, {createConfigObject} from './imap/MailReader';
import { ExtendentContext } from './types/ExtendedContext';
import { Config } from 'imap'

dotenv.config();

const {
    MAIL_LOGIN,
    MAIL_PASSWORD,
    TELEGRAM_API_TOKEN
} = process.env
console.log("bool" + !MAIL_LOGIN || !MAIL_PASSWORD || !TELEGRAM_API_TOKEN)
if(!MAIL_LOGIN || !MAIL_PASSWORD || !TELEGRAM_API_TOKEN){
    console.log('Настройте .env файл для начала работы')
    process.exit(0);
}


const bot: Telegraf<ExtendentContext> = new Telegraf<ExtendentContext>(process.env.TELEGRAM_API_TOKEN as string);

bot.context.mailReader = new MailReader(createConfigObject(MAIL_LOGIN as string) as Config);

bot.hears('hi', (ctx) => ctx.reply('Hey there'));

bot.command('get', getLastMails)



bot.launch();

function onExit(reason: string){
    bot.stop(reason)
}

process.once('SIGINT', () => onExit('SIGINT'));
process.once('SIGTERM', () => onExit('SIGTERM'));