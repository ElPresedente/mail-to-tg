import { Telegraf } from "telegraf";
import { ExtendentContext } from "../types/ExtendedContext";
import getAllUsers from "../db/getAllUsers";

const { fork, reply } = Telegraf;

export default fork(async (ctx: ExtendentContext) => {
    //console.log('inside')
    const client = ctx.db;
    const dbo = client.db(ctx.dbName)
    return await getAllUsers(dbo)
})
