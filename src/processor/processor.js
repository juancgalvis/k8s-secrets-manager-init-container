'use strict';

const fs = require('fs');
const logger = require('../common/logger')(__filename);

/**
 *
 * @param secretName
 * @returns function(string): string
 */
function validateSecretPresence(secretName) {
    return secret => {
        if (!secret) {
            const error = `secret ${secretName} returns ${secret}`;
            logger.warn(error);
            throw new Error(error);
        }
        return secret;
    };
}

/**
 *
 * @returns function(string): {*}
 */
function parseSecretObject() {
    return secret => {
        let secretObject;
        try {
            secretObject = JSON.parse(secret);
            logger.info('secret parsed from JSON');
        } catch (e) {
            logger.warn(
                `secret is not a valid JSON, using the default model {"SECRET": "secret value"}`
            );
            secretObject = { SECRET: secret };
        }
        return secretObject;
    };
}

/**
 *
 * @param secretPropertiesMap
 * @returns function(*): string
 */
function constructEnvString(secretPropertiesMap) {
    return secret => {
        let str = '';
        let count = 0;
        Object.keys(secret).forEach(property => {
            const env = secretPropertiesMap[property] || property;
            str += `export "${env}=${secret[property]}"\n`;
            count++;
        });
        logger.info(
            `export file built with ${count} properties and length: ${str.length}`
        );
        return str;
    };
}

/**
 *
 * @param file
 * @returns {function(*=): void}
 */
function exportToFile(file) {
    return data => {
        logger.info('writing file');
        fs.writeFileSync(file, data, { encoding: 'utf8' });
        logger.info('file written');
        return true;
    };
}

module.exports = {
    validateSecretPresence,
    parseSecretObject,
    constructEnvString,
    exportToFile,
};
