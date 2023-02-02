import imaps, { ImapSimpleOptions, ImapSimple, connect } from 'imap-simple'
import Connection, { Config, FetchOptions } from 'imap'
import { simpleParser } from 'mailparser';
import _ from 'lodash'

export function createXOAuthKey(user: string, accessToken: string){
    
}

export default class MailReader{
    connectOptions: ImapSimpleOptions;
    imap: ImapSimple | undefined;

    constructor(imapConfig: Config) {
        this.connectOptions = {
            imap: imapConfig,
            onmail: num => {console.log("new mail arrived: " + num)}
        }

    }

    async connect(){
        this.imap = await connect(this.connectOptions)
    }

    test(){
        if(this.imap === undefined)
            return
        this.imap.openBox('INBOX').then(() => {
            const searchCriteria = [
                'UNSEEN'
            ];
    
            const fetchOptions: FetchOptions = {
                bodies: ['HEADER', 'TEXT'],
                markSeen: false
            };
            this.imap?.search(searchCriteria, fetchOptions).then((messages) => {
                messages.forEach(item => {
                    console.log('email')
                    const parts = _.find(item.parts, {'which': ''})
                    const id = item.attributes.uid;
                    const idHeader = "Imap-Id: "+id+"\r\n";
                    simpleParser(idHeader+parts?.body, (err, mail) => {
                        console.log(mail.subject)
                        console.log(mail.html)
                    });
                });
            })
            .catch(console.error);
        })
        .catch(console.error);
    }
}