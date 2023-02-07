import { Telegraf } from 'telegraf';
import { Message } from 'imap-simple';
import { simpleParser } from 'mailparser';
import { ExtendentContext } from '../types/ExtendedContext';
import Broadcaster from 'telegraf-broadcast';
import { MongoClient } from 'mongodb'
import getAllUsers from '../db/getAllUsers';


export default function(messages: Message[], broadcaster: Broadcaster, db: MongoClient, dbName: string){
    const client = db
    const dbo = client.db(dbName)
    getAllUsers(dbo).then(users => {
        
    })
}