
const { StatusCodes } = require('http-status-codes')
const { readFileSync } = require('fs')
const quotes = JSON.parse(readFileSync("quotes.json", "utf8"))

const quote = async (req, res) => {
    const idx = Math.floor(Math.random() * quotes.length)
    return res.status(StatusCodes.OK).json(quotes[idx])
}

const defaultroute = async (req, res) => {
    res.status(StatusCodes.NOT_FOUND).json(null);
}

module.exports = {
    quote,
    defaultroute,
}