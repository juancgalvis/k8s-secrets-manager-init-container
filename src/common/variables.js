'use strict';

const logger = require('./logger')(__filename);

/**
 *
 * @param vars Array
 */
function validatePresence(vars) {
    const variables = vars || [];
    if (!Array.isArray(variables)) {
        const error = `Passed vars is not array`;
        logger.error(error);
        throw new Error(error);
    }
    const nonExistentVars = [];
    variables.forEach(variable => {
        if (process.env[variable]) {
            logger.info(
                `Required variable: ${variable} has value: ${process.env[variable]}`
            );
        } else {
            nonExistentVars.push(variable);
        }
    });

    if (nonExistentVars.length) {
        const error = `Required vars not exists ${nonExistentVars}`;
        logger.error(error);
        throw new Error(error);
    }
}

module.exports = {
    validatePresence,
};
