'use strict';

var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
var setServiceURLHelpers = require('*/cartridge/scripts/helpers/setServiceURLHelpers');

/**
 * Makes a service call to Rateit to get the rating of the product.
 * @function
 * @returns {Object} rateItService - Service object
*/
function getRating() {
    var rateItService = LocalServiceRegistry.createService('rateit.http.get', {
        createRequest: function (svc, params) {
            svc.setRequestMethod('GET');
            // <-- Setting server side caching using setCachingTTL function. -->
            svc.setCachingTTL(3600);
            setServiceURLHelpers.setServiceUrl(svc, params);
        },
        parseResponse: function (svc, serviceRes) {
            var parseRes = JSON.parse(serviceRes.text);
            return parseRes;
        },
        getRequestLogMessage: function (req) {
            return req;
        },
        getResponseLogMessage: function (res) {
            return res.text;
        }
    });
    return rateItService;
}

/**
 * Makes a service call to Rateit to set the rating of the product.
 * @function
 * @returns {Object} rateItService - Service object
*/
function setRating() {
    var rateItService = LocalServiceRegistry.createService('rateit.http.post', {
        createRequest: function (svc, params) {
            svc.setRequestMethod('POST');
            setServiceURLHelpers.setServiceUrl(svc, params);
        },
        parseResponse: function (svc, serviceRes) {
            var parseRes = JSON.parse(serviceRes.text);
            return parseRes;
        },
        getRequestLogMessage: function (req) {
            return req;
        },
        getResponseLogMessage: function (res) {
            return res.text;
        }
    });
    return rateItService;
}

/**
 * Makes a service call to RateIt to get the reviews of the product.
 * @function
 * @returns {Object} rateItService - Returns a service object.
*/
function getReview() {
    var rateItService = LocalServiceRegistry.createService('rateitreviews.http.get', {
        createRequest: function (svc, params) {
            svc.setRequestMethod('GET');
            setServiceURLHelpers.setServiceUrl(svc, params);
        },
        parseResponse: function (svc, serviceRes) {
            var parseRes = JSON.parse(serviceRes.text);
            return parseRes;
        },
        getRequestLogMessage: function (req) {
            return req;
        },
        getResponseLogMessage: function (res) {
            return res.text;
        }
    });
    return rateItService;
}

/**
 * Makes a service call to RateIt to get the review of the product.
 * @function
 * @returns {Object} rateItService - Returns a service object.
*/
function setReview() {
    var rateItService = LocalServiceRegistry.createService('rateitreviews.http.post', {
        createRequest: function (svc, params) {
            svc.setRequestMethod('POST');
            setServiceURLHelpers.setServiceUrl(svc, params);
        },
        parseResponse: function (svc, serviceRes) {
            var parseRes = JSON.parse(serviceRes.text);
            return parseRes;
        },
        getRequestLogMessage: function (req) {
            return req;
        },
        getResponseLogMessage: function (res) {
            return res.text;
        }
    });
    return rateItService;
}

module.exports = {
    getRating: getRating,
    setRating: setRating,
    getReview: getReview,
    setReview: setReview
};
