import dotenv from "dotenv";
import { IConfig } from "./index.d"

dotenv.config()

const CONFIG: IConfig = {
	mongo: {
		uri: process.env.BIP_DB
	},
	bot_token: process.env.BIP_BOT_TOKEN,
	todoist_token: process.env.TODOIST_TOKEN
}

export default CONFIG;