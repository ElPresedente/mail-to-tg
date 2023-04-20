import { Telegraf } from 'telegraf';
import { Message } from 'imap-simple';
import { simpleParser } from 'mailparser';
import { ExtendentContext } from '../types/ExtendedContext';
import { Telegram } from 'telegraf'; //тут не тот тип, я не могу нащупать нужный импорт
import { MongoClient } from 'mongodb'
import getAllUsers from '../db/getAllUsers';
import _ from 'lodash'
import parseMail from './parseMail';


import fs from 'fs'


export default async function(messages: Message[], telegram_obj: Telegram, db: MongoClient, dbName: string){
    const client = db
    const dbo = client.db(dbName)
    if(messages.length == 0)
        return
    console.log('BROADCAST')
    const users = await getAllUsers(dbo)
    const ids = _.map(users, user => user.chat_id)
    messages.forEach(msg => {
        const body = msg.parts[0].body
        simpleParser(body, (err, mail) => {
            //console.log(mail)

            parseMail(mail)
            
            ids.forEach(id => {
                const text = mail.text ?? "скоро спарсим"
                telegram_obj.sendMessage(id, text)
            })
        })
    })
}