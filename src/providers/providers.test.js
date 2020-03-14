'use strict';

const test = require('ava');
const { resolveProvider } = require('./providers');

test('resolveProvider is a function', t => {
    // Arrange
    // Act
    // Assert
    t.is(typeof resolveProvider, 'function');
});

test('should handle error when non exists required env var', async t => {
    // Arrange
    const envs = ['SECRET', 'EXPORT_PATH'];
    delete process.env.SECRET;
    delete process.env.EXPORT_PATH;
    // Act
    const error = t.throws(() => resolveProvider(), {
        instanceOf: Error,
    });
    // Assert
    t.is(error.message, `Required vars not exists ${envs}`);
});

test('should handle error when invalid provider', async t => {
    // Arrange
    const provider = 'OTHER';
    process.env.SECRET = 'SECRET';
    process.env.EXPORT_PATH = 'EXPORT_PATH';
    process.env.PROVIDER = provider;
    // Act
    const error = t.throws(() => resolveProvider(), {
        instanceOf: Error,
    });
    // Assert
    t.is(error.message, `Invalid provider configured ${provider}`);
});

test('should return aws provider', async t => {
    // Arrange
    delete process.env.PROVIDER;
    process.env.SECRET = 'SECRET';
    process.env.EXPORT_PATH = 'EXPORT_PATH';
    // Act
    const provider = resolveProvider();
    // Assert
    t.is(typeof provider, 'object');
    t.is(typeof provider.getSecret, 'function');
});

test('should resolve memory provider', async t => {
    // Arrange
    process.env.PROVIDER = 'MEMORY';
    process.env.SECRET = 'SECRET';
    process.env.EXPORT_PATH = 'EXPORT_PATH';
    // Act
    const provider = resolveProvider();
    // Assert
    t.is(typeof provider, 'object');
    t.is(typeof provider.getSecret, 'function');
});
