import winston from "winston";

const transporteArchivoInfo = new winston.transports.File(
    {
        level: "info",
        filename: "./src/utils/errorLogs.log",
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        )
    }
)

const transporteArchivoDebug = new winston.transports.File(
    {
        level: "debug",
        filename: "./src/utils/errorLogs.log",
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        )
    }
)

const transporteConsola = new winston.transports.Console(
    {
        level: "http",
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.simple()
        )
    }
)

export const logger = winston.createLogger(
    {
        transports: [
            transporteConsola,
            transporteArchivoDebug,
            transporteArchivoInfo
        ]
    }
)

export const middLogger = (req,res,next) =>{
    req.logger = logger;


    next();
}