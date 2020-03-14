'use strict';

const test = require('ava');
const logger = require('./logger');

test('logger is a function', t => {
    // Arrange
    // Act
    // Assert
    t.is(typeof logger, 'function');
});

test('logger has log functions', t => {
    // Arrange
    const name = 'logger_name';
    // Act
    const log = logger(name);
    // Assert
    t.is(log.level.levelStr, 'DEBUG');
    t.is(log.category, name);
    t.is(typeof log.info, 'function');
    t.is(typeof log.debug, 'function');
    t.is(typeof log.warn, 'function');
    t.is(typeof log.error, 'function');
});
