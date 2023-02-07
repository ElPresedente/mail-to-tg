import { Telegraf } from 'telegraf';
import dotenv from 'dotenv'
import getAllUsers from './commands/getAllUsers';
import subscribe from './commands/subscribe';
import setCommands from './misc/setCommands';
import broadcastMails from './misc/broadcastMails';
import MailReader, {createConfigObject} from './imap/MailReader';
import { ExtendentContext } from './types/ExtendedContext';
import { Config } from 'imap'
import {MongoClient} from 'mongodb'
import Broadcaster from 'telegraf-broadcast'
 
dotenv.config();

const {
    MAIL_LOGIN,
    MAIL_PASSWORD,
    TELEGRAM_API_TOKEN,
    MONGODB_URL,
    DATABASE_NAME,
} = process.env;
if(!MAIL_LOGIN 
    || !MAIL_PASSWORD 
    || !TELEGRAM_API_TOKEN
    || !MONGODB_URL
    || !DATABASE_NAME){
    console.log('Настройте .env файл для начала работы')
    process.exit(0);
}


const bot: Telegraf<ExtendentContext> = new Telegraf<ExtendentContext>(process.env.TELEGRAM_API_TOKEN as string);
const broadcaster = new Broadcaster(bot, {})
setCommands(bot)

bot.context.mailReader = new MailReader(createConfigObject(MAIL_LOGIN as string) as Config);
bot.context.email = MAIL_LOGIN;
bot.context.password = MAIL_PASSWORD;
bot.context.db = new MongoClient(MONGODB_URL)
bot.context.dbName = DATABASE_NAME;
bot.context.db.connect()

bot.context.mailReader.onNewMailArrive = messages => {
    broadcastMails(messages, broadcaster, bot.context.db as MongoClient, bot.context.dbName as string)
}

bot.hears('hi', (ctx) => ctx.reply('Hey there'));

bot.command('get', getAllUsers)
bot.command('subscribe', subscribe)



bot.launch();

function onExit(reason: string){
    bot.context.db?.close();
    bot.stop(reason)
}

process.once('SIGINT' , () => onExit('SIGINT'));
process.once('SIGTERM', () => onExit('SIGTERM'));