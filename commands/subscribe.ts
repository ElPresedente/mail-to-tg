import { Telegraf, Context } from "telegraf";
import { ExtendentContext } from "../types/ExtendedContext";
import insertNewSubscriber from '../db/insertNewSubscriber'

const { fork } = Telegraf;

export default fork(async (ctx: ExtendentContext) => {
    const client = ctx.db;
    const dbo = client.db(ctx.dbName)
    ctx.reply(await insertNewSubscriber(dbo, ctx.from, ctx.chat?.id))
})