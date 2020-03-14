'use strict';

const logger = require('./common/logger')(__filename);
const { load } = require('./loader');

module.exports = load()
    .then(written => {
        logger.info(`File written: ${written}`);
        process.exit(0);
    })
    .catch(error => {
        logger.error(error);
        process.exit(1);
    });
