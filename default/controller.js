
const { StatusCodes } = require('http-status-codes')

const defaultroute = async (req, res) => {
    res.status(StatusCodes.NOT_FOUND).json(null);
}

module.exports = {
    defaultroute,
}