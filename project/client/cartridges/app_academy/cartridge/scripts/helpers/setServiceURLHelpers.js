'use strict';

/**
 * This function sets the url for the service call.
 * @function
 * @param {Object} svc - dw/svc/HTTPService : Contains the service object
 * @param {Object} serviceParams - Parameters passed from the controller to the service file.
*/
function setServiceUrl(svc, serviceParams) {
    var Logger = require('dw/system/Logger');
    var Resource = require('dw/web/Resource');
    if (Object.keys(serviceParams).length === 0) {
        Logger.error('Error setting service URL {0}: {1}', svc.configuration.ID, Resource.msg('error.logger.serviceparams', 'productFeedback', null));
        return;
    }
    var serviceURL = svc.getURL();
    var paramsKeys = Object.keys(serviceParams);
    paramsKeys.forEach(function (paramKey, index) {
        if (index === 0) {
            serviceURL += '?' + paramKey + '=' + serviceParams[paramKey];
        } else {
            serviceURL += '&' + paramKey + '=' + serviceParams[paramKey];
        }
    });
    svc.setURL(encodeURI(serviceURL));
}

module.exports = {
    setServiceUrl: setServiceUrl
};
