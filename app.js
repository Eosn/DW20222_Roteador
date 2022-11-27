require('dotenv').config()
const express = require('express')
const app = express()
const User = require('./models/user/index.js')
const Post = require('./models/post/index.js')
const { client } = require('./gvars.js')

app.use(express.static('./static'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// ROUTES
const quoteRoutes = require('./quote/routes.js')
app.use('/quote', quoteRoutes)

const defaultRoutes = require('./default/routes.js')
app.use('/', defaultRoutes)


//APP
const port = process.env.PORT || 3000
const start = async () => {
    try {
        await client.connect()
        await new User().initDDL()
        await new Post().initDDL()
        app.listen(port, () => {
            console.log(`Listen on http://localhost:${port}.`)
        })
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

start()