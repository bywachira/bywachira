import { Telegraf } from "telegraf";
import config from "../config";
import Todoist from "../todoist";

const bot = new Telegraf(config.bot_token)

const todoist = new Todoist(config.todoist_token);

bot.start((ctx: any) => ctx.reply("Welcome to Build In Public"));

bot.command("projects", async (ctx: any) => {
	const MESSAGE = todoist.projectsToString(await todoist.fetchProjects())

	ctx.replyWithMarkdown(MESSAGE)
})

export default bot;