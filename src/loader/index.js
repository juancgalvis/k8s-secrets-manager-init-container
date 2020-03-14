'use strict';

const logger = require('../common/logger')(__filename);
const { resolveProvider } = require('../providers/providers');
const {
    validateSecretPresence,
    parseSecretObject,
    constructEnvString,
    exportToFile,
} = require('../processor/processor');

/**
 *
 * @returns {Promise<void>}
 */
function load() {
    const provider = resolveProvider();

    const secretName = process.env.SECRET;
    const secretMap = process.env.SECRET_MAP;
    const exportPath = process.env.EXPORT_PATH;
    const ms = process.env.TIMEOUT ? parseInt(process.env.TIMEOUT) : 10000;

    let secretPropertiesMap = {};

    if (secretMap) {
        try {
            secretPropertiesMap = JSON.parse(secretMap);
            logger.info('using custom mapping from SECRET_MAP env');
        } catch (ignored) {
            logger.warn(
                `invalid SECRET_MAP, it should be a valid JSON ${secretMap}`
            );
        }
    }

    const timeout = new Promise((resolve, reject) => {
        const id = setTimeout(() => {
            clearTimeout(id);
            reject(new Error(`Timed out in ${ms}ms.`));
        }, ms);
    });

    const promise = provider
        .getSecret(secretName)
        .then(validateSecretPresence(secretName))
        .then(parseSecretObject())
        .then(constructEnvString(secretPropertiesMap))
        .then(exportToFile(exportPath))
        .catch(error => {
            logger.error(error);
            throw error;
        });

    return Promise.race([promise, timeout]);
}

module.exports = { load };
