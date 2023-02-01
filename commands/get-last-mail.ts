import { Telegraf } from "telegraf";
import imaps from 'imap-simple'
import Connection from 'imap'

const { fork, reply } = Telegraf;

const {
    MAIL_LOGIN,
    MAIL_PASSWORD
} = process.env

if(MAIL_LOGIN === undefined || MAIL_PASSWORD === undefined){
    console.error("в файле .env отсутствуют необходимые данные")
}

const config: Connection.Config = {
    user: MAIL_LOGIN as string,
    password: MAIL_PASSWORD as string,
    tls: true,
    host: "imap.gmail.com",
    port: 993,
}

const getLastMails = fork(ctx => {

})