'use strict';

const logger = require('../common/logger')(__filename);
const { validatePresence } = require('../common/variables');
const aws = require('./aws/aws');
const memory = require('./memory/memory');

/**
 *
 * @param provider
 * @returns {{getSecret: function(*=): Promise<string>}}
 */
function resolveProviderImp(provider) {
    switch (provider) {
        case 'AWS': {
            return aws;
        }
        case 'MEMORY': {
            return memory;
        }
        default: {
            const error = `Invalid provider configured ${provider}`;
            logger.error(error);
            throw new Error(error);
        }
    }
}

/**
 *
 * @returns {{getSecret: (function(*=): Promise<string>)}}
 */
function resolveProvider() {
    validatePresence(['SECRET', 'EXPORT_PATH']);
    return resolveProviderImp(process.env.PROVIDER || 'AWS');
}

module.exports = { resolveProvider };
