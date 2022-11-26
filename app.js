const express = require('express')
const app = express()

app.use(express.static('./public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// ROUTES
const routes = require('./routes.js')
app.use('/', routes)


//APP
const port = process.env.PORT || 3000
const start = async () => {
    try {
        app.listen(port, () => {
            console.log(`Listen on http://localhost:${port}.`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()