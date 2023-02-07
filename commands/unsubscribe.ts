import { Telegraf, Context } from "telegraf";
import { ExtendentContext } from "../types/ExtendedContext";
import removeSubscriber from '../db/removeSubscriber'

const { fork } = Telegraf;

export default fork(async (ctx: ExtendentContext) => {
    const client = ctx.db;
    const dbo = client.db(ctx.dbName)
    ctx.reply(await removeSubscriber(dbo, ctx.from))
})