import { Telegraf } from "telegraf";
import { Config } from 'imap'

import MailReader from '../imap/MailReader'

const { fork, reply } = Telegraf;

const {
    MAIL_LOGIN,
    MAIL_PASSWORD
} = process.env

if(MAIL_LOGIN === undefined || MAIL_PASSWORD === undefined){
    console.error("в файле .env отсутствуют необходимые данные")
}

const config: Config = {
    user: MAIL_LOGIN as string,
    password: MAIL_PASSWORD as string,
    tls: true,
    host: "imap.gmail.com",
    port: 993,
    keepalive: true
}

export default fork(ctx => {
    const obj: MailReader = new MailReader(config)
    obj.connect().then(() => {
        obj.test()
    })
    
})