import imaps, { ImapSimpleOptions, ImapSimple, connect } from 'imap-simple'
import Connection, { Config, FetchOptions } from 'imap'
import { simpleParser } from 'mailparser';

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
                    
                })
            })
        })
    }
}