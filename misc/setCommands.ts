import { Telegraf } from 'telegraf';
import { ExtendentContext } from '../types/ExtendedContext';


export default function (bot: Telegraf<ExtendentContext>){
    bot.telegram.setMyCommands([
        {
            command: "subscribe",
            description: "Подписаться на рассылку"
        },
        {
            command: "unsubscribe",
            description: "Отписаться от рассылки"
        }
    ])
}