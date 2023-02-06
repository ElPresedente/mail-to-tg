import { Telegraf } from "telegraf";
import { Config } from 'imap'

import MailReader, {createConfigObject} from '../imap/MailReader'

import gmailXOAuth from '../imap/gmailXOAuth2'

const { fork, reply } = Telegraf;

export default fork(async ctx => {
    const {
        MAIL_LOGIN,
        MAIL_PASSWORD
    } = process.env
    
    
    let config: Config = createConfigObject(MAIL_LOGIN as string) as Config

    if(config.user.split('@')[1] === 'gmail.com'){
        //гугл зло
        //config.xoauth2 = await gmailXOAuth()
    }

    const obj: MailReader = new MailReader(config)
    obj.connect().then(() => {
        obj.test()
    })
    .catch(console.error)
    

    reply('text')
})