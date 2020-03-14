'use strict';

const { validatePresence } = require('../../common/variables');
/**
 *
 * @param secret
 * @returns {Promise<string>}
 */
function getSecretImplementation(secret, wait) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(secret);
        }, wait);
    });
}

/**
 *
 * @param secret
 * @returns {Promise<string>}
 */
function getSecret(secret) {
    const wait = parseInt(process.env.TEST_WAIT || '0');
    return getSecretImplementation(secret, wait);
}

module.exports = { getSecret };
