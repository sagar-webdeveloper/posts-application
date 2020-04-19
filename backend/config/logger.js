const { createLogger, transports, format } = require('winston');

require('winston-mongodb');
const logger = createLogger({
    transports: [
        new transports.MongoDB({
            level: 'error',
            db: "mongodb+srv://sagar:n4WfnT3CofKEioew@cluster0-tkwya.mongodb.net/doyour-bit?retryWrites=true&w=majority",
            options: { useUnifiedTopology: true },
            collection: 'logs',
            format: format.combine(format.timestamp(), format.json())
        })
    ]
})

module.exports = logger;