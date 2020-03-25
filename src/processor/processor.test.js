'use strict';

const test = require('ava');
const rewire = require('rewire');
const sinon = require('sinon');
const processor = rewire('./processor');
const {
    validateSecretPresence,
    parseSecretObject,
    constructEnvString,
    exportToFile,
} = processor;

test('validateSecretPresence should return a function', t => {
    // Arrange
    const secretName = 'secretName';
    // Act
    const validate = validateSecretPresence(secretName);
    // Assert
    t.is(typeof validate, 'function');
});

test('validateSecretPresence should not handle error when secret has value', t => {
    // Arrange
    const secretName = 'secretName';
    const secret = 'secret';
    const validate = validateSecretPresence(secretName);
    // Act
    const result = validate(secret);
    // Assert
    t.is(result, secret);
});

test('validateSecretPresence should handle error when invalid secret', async t => {
    // Arrange
    const secretName = 'secretName';
    const secret = '';
    const validate = validateSecretPresence(secretName);
    // Act
    const error = t.throws(() => validate(secret), {
        instanceOf: Error,
    });
    // Assert
    t.is(error.message, `secret ${secretName} returns ${secret}`);
});

test('parseSecretObject should return a function', t => {
    // Arrange
    // Act
    const parse = parseSecretObject();
    // Assert
    t.is(typeof parse, 'function');
});

test('validateSecretPresence should not handle error when secret is json', t => {
    // Arrange
    const secret = '{"key":"value"}';
    const parse = parseSecretObject();
    // Act
    const result = parse(secret);
    // Assert
    t.deepEqual(result, { key: 'value' });
});

test('validateSecretPresence should fallback when invalid json secret', async t => {
    // Arrange
    const secret = 'bad json';
    const parse = parseSecretObject();
    // Act
    const result = parse(secret);
    // Assert
    t.deepEqual(result, { SECRET: secret });
});

test('constructEnvString should return a function', t => {
    // Arrange
    // Act
    const construct = constructEnvString({});
    // Assert
    t.is(typeof construct, 'function');
});

test('constructEnvString should not handle error when object has no keys', t => {
    // Arrange
    const secret = {};
    const construct = constructEnvString({});
    // Act
    const result = construct(secret);
    // Assert
    t.is(result, '');
});

test('constructEnvString should return secret as export envs string', t => {
    // Arrange
    const secret = {
        key1: 'key1',
        key2: 'key2',
        key3: '1000',
    };
    const construct = constructEnvString({});
    // Act
    const result = construct(secret);
    // Assert
    t.is(
        result,
        'export "key1=key1"\nexport "key2=key2"\nexport "key3=1000"\n'
    );
});

test('exportToFile should return a function', t => {
    // Arrangeç
    const file = 'file.txt';
    // Act
    const exportFile = exportToFile(file);
    // Assert
    t.is(typeof exportFile, 'function');
});

test('exportToFile should call write file', t => {
    // Arrange
    const writeFileSyncSpy = sinon.spy();
    processor.__set__('fs', { writeFileSync: writeFileSyncSpy });
    const file = 'file.txt';
    const secretEnv = 'export key1=key1';
    const exportFile = exportToFile(file);
    // Act
    const written = exportFile(secretEnv);
    // Assert
    t.true(writeFileSyncSpy.calledWith(file, secretEnv, { encoding: 'utf8' }));
    t.true(written);
});
