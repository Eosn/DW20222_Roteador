
const { StatusCodes } = require('http-status-codes')
const { readFileSync } = require('fs')
const quotes = JSON.parse(readFileSync("./quote/quotes.json", "utf8"))

const quote = async (req, res) => {
    return res.status(StatusCodes.OK).json(quotes)
}

module.exports = {
    quote,
}