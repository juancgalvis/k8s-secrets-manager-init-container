'use strict';

const SecretsManager = require('aws-sdk/clients/secretsmanager');
const logger = require('../../common/logger')(__filename);

/**
 *
 * @param SecretId
 * @param region
 * @param accessKeyId
 * @param secretAccessKey
 * @returns {Promise<string>}
 */
function getSecretImplementation(
    SecretId,
    region,
    accessKeyId,
    secretAccessKey
) {
    return new Promise((resolve, reject) => {
        logger.info(`loading ${SecretId} secret from region ${region}`);
        const client = new SecretsManager({
            accessKeyId,
            secretAccessKey,
            region,
        });
        logger.info(`client created`);
        client.getSecretValue({ SecretId }, (err, data) => {
            if (err) {
                const errorMsg = `error generated getting ${SecretId} secret`;
                logger.error(errorMsg, err);
                return reject(new Error(errorMsg));
            }
            if ('SecretString' in data) {
                logger.info('getting from string');
                return resolve(data.SecretString);
            } else {
                logger.info('decoding binary');
                const buff = new Buffer(data.SecretBinary, 'base64');
                return resolve(buff.toString('ascii'));
            }
        });
    });
}

/**
 *
 * @param secret
 * @returns {Promise<string>}
 */
function getSecret(secret) {
    return getSecretImplementation(
        secret,
        process.env.AWS_REGION || 'us-east-1',
        process.env.AWS_ACCESS_KEY_ID,
        process.env.AWS_ACCESS_KEY_SECRET
    );
}

module.exports = { getSecret };
