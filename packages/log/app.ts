import http from "http";
import SocketServer from "websocket"
import express from "express"
import morgan from "morgan"
import bodyParser from "body-parser"
import cors from "cors"
import chalk from "chalk"
import mongoose from "mongoose"

import config from "./config"
import BOT from "./bot";

mongoose.connect(config.mongo.uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

mongoose.connection.on("open", (err) => {
    if (err) console.log(chalk.red(`[DATABASE] Error connecting to the database: [${err}]`))

    console.log(chalk.white("[DATABASE]: Connected successfully"))
})

const APP = express()

APP.set("PORT", process.env.PORT || 5000)

APP.use(cors())

APP.use(bodyParser.json())

APP.use(bodyParser.urlencoded({ extended: true }))

APP.use(morgan("dev"))

BOT.launch()

APP.listen(APP.get("PORT"), () => {
    console.log(chalk.yellowBright(`[Server]: Running on PORT ${APP.get("PORT")}`))
})