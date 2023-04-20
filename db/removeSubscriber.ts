import { Db } from 'mongodb'
import { ExtendentContext } from '../types/ExtendedContext'
import { User } from 'node-telegram-bot-api'

export default function (dbo: Db, user: User | undefined) : Promise<string>{
    return new Promise<string>(async resolve => {
        const document = dbo.collection('users')
        const query = {id: user?.id}
        //console.log(query)
        const val = await document.findOne(query)
        //console.log(user)
        if(val == null){
            resolve("Вы не были подписаны на рассылку :()")
        }
        else{
            await document.deleteOne(query)
            resolve('Вам больше не будут приходить сообщения')
        }
    })
}