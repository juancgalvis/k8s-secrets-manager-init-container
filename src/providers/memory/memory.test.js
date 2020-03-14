'use strict';

const test = require('ava');
const { getSecret } = require('./memory');

test('getSecret should return a function', t => {
    // Arrange
    // Act
    // Assert
    t.is(typeof getSecret, 'function');
});

test('getSecret should return when secret has value', async t => {
    // Arrange
    const secret = '{"key":"value"}';
    // Act
    const result = getSecret(secret);
    // Assert
    t.is(await result, secret);
});
