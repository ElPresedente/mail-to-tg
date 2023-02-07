import { Context } from 'telegraf'
import MailReader from '../imap/MailReader'
import { MongoClient } from 'mongodb'
 
export interface ExtendentContext extends Context{
    mailReader: MailReader,
    email: String,
    password: String,
    db: MongoClient,
    dbName: string,
}