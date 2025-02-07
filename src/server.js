const express   = require("express")
const rateLimit = require("express-rate-limit")
const path      = require("path")

const app     = express()
const limiter = rateLimit({
	max: 1000,
	windowMs: 30 * 60 * 1000,
	standardHeaders: true,
	legacyHeaders: false,
})

app.use('/', limiter)
app.use(express.static(path.join(__dirname, "../public")))

app.get('/', (request, response) => response.sendFile(path.join(__dirname, "./views/index.html")))
app.get('*', (request, response) => response.sendFile(path.join(__dirname, "./views/404.html")))

app.listen(80)