'use strict';

const log4js = require('log4js');

log4js.configure({
    appenders: {
        console: { type: 'console' },
    },
    categories: {
        default: {
            appenders: ['console'],
            level: log4js.levels.DEBUG.levelStr,
        },
    },
});

module.exports = log4js.getLogger;
