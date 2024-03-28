const express = require('express')
const counterRouter = require('./routes/counter')

const app = express()
app.use(express.json())
app.use('/', counterRouter)

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log(`Serve counter run on PORT ${PORT}`)
})