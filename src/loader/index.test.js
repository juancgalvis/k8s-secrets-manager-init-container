'use strict';

const test = require('ava');
const rewire = require('rewire');
const loader = rewire('./index');
const { load } = loader;

function prepareCommon() {
    process.env.SECRET = 'secret';
    process.env.PROVIDER = 'AWS';
    process.env.EXPORT_PATH = 'EXPORT_PATH';
    const secretValue = '{"key":"value"}';
    loader.__set__('exportToFile', () => () => true);
    loader.__set__('resolveProvider', () => ({
        getSecret: () => Promise.resolve(secretValue),
    }));
}

test('load should be success', async t => {
    // Arrange
    prepareCommon();
    // Act
    const loaded = await load();
    // Assert
    t.true(loaded);
});

test('load should be success when use a valid json map', async t => {
    // Arrange
    process.env.SECRET_MAP = '{"key":"KEY"}';
    prepareCommon();
    // Act
    const loaded = await load();
    // Assert
    t.true(loaded);
});

test('load should be success when use a invalid json map', async t => {
    // Arrange
    process.env.SECRET_MAP = '{"key":"KEY}';
    prepareCommon();
    // Act
    const loaded = await load();
    // Assert
    t.true(loaded);
});

test('load handle error when anything fails', async t => {
    // Arrange
    prepareCommon();
    loader.__set__('exportToFile', () => () => {
        throw new Error('custom error');
    });
    // Act
    const error = await t.throwsAsync(
        async () => {
            await load();
        },
        { instanceOf: Error }
    );
    // Assert
    t.is(error.message, `custom error`);
});

test('load handle error with timeout', async t => {
    // Arrange
    prepareCommon();
    process.env.TIMEOUT = 0;
    loader.__set__('exportToFile', () => () => {
        throw new Error('custom error');
    });
    // Act
    await t.throwsAsync(
        async () => {
            await load();
        },
        { instanceOf: Error }
    );
});
