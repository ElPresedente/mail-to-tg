import { Db } from 'mongodb'
import { ExtendentContext } from '../types/ExtendedContext'
import { User } from 'node-telegram-bot-api'



export default function(dbo: Db, user: User | undefined) : Promise<string>{
    return new Promise<string>(async resolve => {
        const document = dbo.collection('users')
        const query = {id: user?.id}
        console.log(query)
        const val = await document.findOne(query)
        console.log(user)
        if(val == null)
        {
            const data = {
                name: user?.username ?? user?.first_name,
                id: user?.id,
            }
            document.insertOne(data).then(doc => {
                resolve(`Поздравляем ${data.name}, вы внесены в бд`)
            })
        }
        else{
            resolve('Вы уже подписаны на рассылку')
        }
    })
}