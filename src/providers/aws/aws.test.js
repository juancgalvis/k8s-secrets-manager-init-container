'use strict';

const test = require('ava');
const rewire = require('rewire');
const sinon = require('sinon');
const aws = rewire('./aws');
const { getSecret } = aws;

test('getSecret should return a function', t => {
    // Arrange
    // Act
    // Assert
    t.is(typeof getSecret, 'function');
});

test('getSecret should return when secret has value', async t => {
    // Arrange
    const secret = 'secret';
    const secretValue = '{"key":"value"}';
    const secretsManager = function() {};
    secretsManager.prototype.getSecretValue = (_, cb) => {
        cb(null, { SecretString: secretValue });
    };
    const secretsManagerSpy = sinon.spy(secretsManager);
    aws.__set__('SecretsManager', secretsManagerSpy);
    // Act
    const result = getSecret(secret);
    // Assert
    t.is(await result, secretValue);
});

test('getSecret should return when secret has binary value', async t => {
    // Arrange
    const secret = 'secret';
    const secretValue = '{"key":"value"}';
    const secretValueB64 = Buffer.from(secretValue).toString('base64');
    const secretsManager = function() {};
    secretsManager.prototype.getSecretValue = (_, cb) => {
        cb(null, { SecretBinary: secretValueB64 });
    };
    const secretsManagerSpy = sinon.spy(secretsManager);
    aws.__set__('SecretsManager', secretsManagerSpy);
    // Act
    const result = getSecret(secret);
    // Assert
    t.is(await result, secretValue);
});

test('getSecret should handle error when aws error', async t => {
    // Arrange
    const secret = 'secret';
    const secretsManager = function() {};
    secretsManager.prototype.getSecretValue = (_, cb) => {
        cb('Error from aws');
    };
    const secretsManagerSpy = sinon.spy(secretsManager);
    aws.__set__('SecretsManager', secretsManagerSpy);
    // Act
    const result = getSecret(secret);
    // Assert
    const error = await t.throwsAsync(
        async () => {
            await result;
        },
        { instanceOf: Error }
    );
    t.is(error.message, `error generated getting ${secret} secret`);
});
