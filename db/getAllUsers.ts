import { Db } from 'mongodb'
import User from '../types/Database/User'


export default async function(dbo: Db) : Promise<User[]>{
    return new Promise<User[]>(async resolve => {
        const document = dbo.collection('users');
        const query = {}
        const users = await document.find(query).toArray()
        let returnArray: User[] = [];
        users.forEach(val => {
            returnArray.push({
                name: val.name,
                id: val.id,
                chat_id: val.chat_id
            })
        })
        resolve(returnArray)
    })
}