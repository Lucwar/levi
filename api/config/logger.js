import { format, createLogger, transports } from "winston";
import settings from './settings';
import 'winston-mongodb';

const { timestamp, combine, errors, printf } = format;

const consoleLevel = settings.database.logging === 'dev' ? 'info' : 'error';
const mongoLevel = 'http';

const logFormat = printf(log => `
----------------------------- LOG -----------------------------
${new Date().toLocaleString()} - ${log.level}: ${log.message}
----------------------------- LOG -----------------------------
`);

const mongoDBTransport = new transports.MongoDB({
    db: settings.database.uri,
    collection: 'logs',
    metaKey: 'payload',
    level: mongoLevel,
    capped: true,
    cappedSize: 60 * 1000000,
    options: { useUnifiedTopology: true },
    leaveConnectionOpen: false,
    // cappedMax: 5000,
});

const logger = createLogger({
    exitOnError: false,
    level: consoleLevel,
    format: combine(timestamp(), errors({ stack: true }), logFormat),
    transports: [ new transports.Console(), mongoDBTransport ],
    exceptionHandlers: [ new transports.Console(), mongoDBTransport ],
});

export { logger };