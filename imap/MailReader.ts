import imaps, { ImapSimpleOptions, ImapSimple, connect } from 'imap-simple'
import Connection, { Config, FetchOptions } from 'imap'
import { Source, simpleParser } from 'mailparser';
import _ from 'lodash'
import { bold } from 'telegraf/typings/format';

export function createXOAuthKey(user: string, accessToken: string){
    
}

export function createConfigObject(email: string) : Config | undefined {
    const parts = email.split('@')
    const {
        MAIL_LOGIN,
        MAIL_PASSWORD
    } = process.env
    switch(parts[1]){
        case 'gmail.com': {
            return {
                user: MAIL_LOGIN as string,
                password: MAIL_PASSWORD as string,
                tls: true,
                tlsOptions: { 
                    rejectUnauthorized: false 
                },
                host: "imap.gmail.com",
                port: 993,
                keepalive: true,
                xoauth2: "" // вот тут и будем ключ запрашивать
            }
        }
        case 'yandex.ru': {
            return {
                user: MAIL_LOGIN as string,
                password: MAIL_PASSWORD as string,
                tls: true,
                tlsOptions: { 
                    rejectUnauthorized: false 
                },
                host: "imap.yandex.ru",
                port: 993,
                keepalive: true,
            }
        }
    }
}

export default class MailReader{
    connectOptions: ImapSimpleOptions;
    imap: ImapSimple | undefined;

    constructor(imapConfig: Config) {
        this.connectOptions = {
            imap: imapConfig,
            onmail: num => this.newMailEvent(num)
        }
        console.log('constructed')
        connect(this.connectOptions)
        .then(imap => {
            this.imap = imap
            this.imap.openBox('INBOX')
        })
    }

    newMailEvent(num: number){
        console.log(`Пришли новые письма, теперь в ящике ${num} писем`)
        this.fetchAndSendMails()
    }

    fetchAndSendMails(){
        if(this.imap === undefined)
            return
        
        const searchCriteria = [
            'UNSEEN'
        ];

        const fetchOptions: FetchOptions = {
            bodies: '',
            markSeen: true
        };

        console.log('fetching')
        this.imap?.search(searchCriteria, fetchOptions).then((messages) => {
            messages.forEach(item => {
                const parts = _.find(item.parts, {'which': 'TEXT'})
                const id = item.attributes.uid;
                const idHeader = "Imap-Id: "+id+"\r\n";
                simpleParser(item.parts[0].body, (err, mail) => {
                    console.log(mail.headers)
                    console.log(mail.text)
                }); 
                return
            });
        })
        .catch(console.error);
    }
}