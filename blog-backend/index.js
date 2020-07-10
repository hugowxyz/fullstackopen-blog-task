const logger = require('./utils/logger')
const config = require('./utils/config')
const app = require('./app')
const http = require('http')

const server = http.createServer(app)

server.listen(config.PORT, () => {
    logger.info('Server listening on port', config.PORT)
})