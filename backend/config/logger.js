const { createLogger, transports, format } = require('winston');

require('winston-mongodb');
const logger = createLogger({
    transports: [
        new transports.File({
            filename: 'info.log',
            level: 'info',
            format: format.combine(format.timestamp(), format.json())
        }),
        new transports.MongoDB({
            level: 'error',
            db: "mongodb+srv://sagar:" +
                process.env.MONGO_ATLAS_PW +
                "@cluster0-tkwya.mongodb.net/doyour-bit?retryWrites=true&w=majority",
            options: { useUnifiedTopology: true },
            collection: 'logs',
            format: format.combine(format.timestamp(), format.json())
        })
    ]
})

module.exports = logger;