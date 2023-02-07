import { Context } from 'telegraf'
import MailReader from '../imap/MailReader'
 
export interface ExtendentContext extends Context{
    mailReader: MailReader,
    email: String,
    password: String,
    token: String,
}