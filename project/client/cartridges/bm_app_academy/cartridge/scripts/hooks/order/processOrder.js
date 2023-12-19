'use strict';

var Logger = require('dw/system/Logger');

/**
 * After Hook which handles the databse operation on Order Notes.
 * @param {Object} customObject - The created custom object
 * @param {Object} create - The create document; may be null.
*/
function afterPut(customObject, create) { // eslint-disable-line
    Logger.debug('Executing afterPut hook for orderNo: {0}', customObject.custom.orderNo);
};

exports.afterPut = afterPut;
