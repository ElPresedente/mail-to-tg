const xoauth2 = require('xoauth2')
import path from 'path'
import { authenticate } from '@google-cloud/local-auth'
import { google } from 'googleapis'
import fs from 'fs'
import http from 'http'
import opn from 'open'
import {URL} from 'url'
import db from 'sqlite3'



interface GoogleToken{
    type: string;
    client_id: string;
    client_secret: string;
    refresh_token: string;
}


const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
const SCOPES = ['https://mail.google.com/']//['https://www.googleapis.com/auth/gmail.readonly'];
const CALLBACK_URI = '/oauth2callback'

function saveCredentials(client: any) {
    const content = fs.readFileSync(CREDENTIALS_PATH);
    const keys = JSON.parse(content.toString('utf8'));
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    fs.writeFileSync(TOKEN_PATH, payload);
}

function loadSavedCredentialsIfExist() {
    try {
        const content = fs.readFileSync(TOKEN_PATH);
        const credentials = JSON.parse(content.toString('utf8'));
        return credentials;
    } catch (err) {
        return null;
    }
}

function getCallbackUrl(service: string = ''){
    const port = process.env.PORT ?? '3000';
    return `http://localhost:${port}${service}`
}

export default async () => {
    const credentials = loadSavedCredentialsIfExist().installed
    const oauth2Client = new google.auth.OAuth2(
        credentials.client_id,
        credentials.client_secret,
        getCallbackUrl(CALLBACK_URI),
        //TODO: там можно для безопасности еще шутки передавать, пока без них
    )
    //получаем ссылку для авторизации
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES.join(' ')
    })
    //для получения токена, гугл должен нам его скинуть
    //для этого заводим хттп сервак на время
    const port = process.env.PORT ?? '3000';
    const server = http.createServer(async (req, res) => {
        try{
            if((req.url?.indexOf(CALLBACK_URI) ?? -1) > -1){ //чет TS перебарщивает с проверками но ладно
                const qs = new URL(req.url ?? '', getCallbackUrl()).searchParams
                res.end('Успешная авторизация, можете закрыть страницу')
                server.close()
                const {tokens} = await oauth2Client.getToken(qs.get('code') ?? '');
                oauth2Client.credentials = tokens
                saveCredentials(oauth2Client)
            }
        }
        catch (e){
            console.error(e)
        }
    })
    .listen(port,() => {
        opn(authUrl, {wait: false})
            .then(cp => cp.unref())
    })
    
}
