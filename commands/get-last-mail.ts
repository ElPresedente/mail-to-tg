import { Telegraf } from "telegraf";
import { Config } from 'imap'

import MailReader from '../imap/MailReader'

import gmailXOAuth from '../imap/gmailXOAuth2'

const { fork, reply } = Telegraf;

export default fork(async ctx => {
    const {
        MAIL_LOGIN,
        MAIL_PASSWORD
    } = process.env
    
    
    let config: Config = {
        user: MAIL_LOGIN as string,
        password: MAIL_PASSWORD as string,
        tls: true,
        tlsOptions: { 
            rejectUnauthorized: false 
        },
        host: "imap.gmail.com",
        port: 993,
        keepalive: true
    }

    if(config.user.split('@')[1] === 'gmail.com'){
        config.xoauth2 = await gmailXOAuth()
    }

    const obj: MailReader = new MailReader(config)
    obj.connect().then(() => {
        obj.test()
    })
    .catch(console.error)
    

    reply('text')
})