'use strict';

const test = require('ava');
const { validatePresence } = require('./variables');

test('should not handle error when undefined or empty array', t => {
    t.plan(0);
    // Arrange
    // Act
    validatePresence();
    validatePresence([]);
    // Assert
});

test('should not handle error when all env vars exists', t => {
    t.plan(0);
    // Arrange
    const env = 'EXISTENT';
    process.env[env] = env;
    // Act
    validatePresence([env]);
    // Assert
});

test('should handle error when invalid array', async t => {
    // Arrange
    // Act
    const error = t.throws(() => validatePresence('invalid'), {
        instanceOf: Error,
    });
    // Assert
    t.is(error.message, 'Passed vars is not array');
});

test('should handle error when non exists an env var', async t => {
    // Arrange
    const envs = ['NON_EXISTENT'];
    // Act
    const error = t.throws(() => validatePresence(envs), {
        instanceOf: Error,
    });
    // Assert
    t.is(error.message, `Required vars not exists ${envs}`);
});
