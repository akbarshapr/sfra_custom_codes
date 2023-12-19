'use strict';

var server = require('server');
var Logger = require('dw/system/Logger');
var Resource = require('dw/web/Resource');
var feedbackServices = require('*/cartridge/scripts/services/feedbackServices');

/**
 * ProductFeedback-Rating: This ProductFeedback-Rating endpoint will get the rating of the product from thirdparty.
 * @param {middleware} - server.middleware.https
*/
server.get('Rating', server.middleware.https, function (req, res, next) {
    var response;
    var productID;
    try {
        productID = req.querystring.pid;
        // Checks if the product id exists, else throws an error.
        if (productID) {
            var feedbackService = feedbackServices.getRating();
            var serviceRespone = feedbackService.call({ pid: productID });
            // Checks is the response object is null, else throws an error.
            if (serviceRespone.object === null) {
                throw new Error(Resource.msg('error.msg.servicedown', 'productFeedback', null));
            }
            response = serviceRespone.object;
        } else {
            throw new Error(Resource.msg('error.msg.parametermissing', 'productFeedback', null));
        }
    } catch (error) {
        Logger.error('Error in ProductFeedback-Rating endpoint: ' + error.message);
        response = {
            success: false,
            error: error.message
        };
    }
    res.render('product/components/starRating', {
        pid: productID,
        response: response
    });
    next();
});

/**
 * ProductFeedback-SubmitRating: This ProductFeedback-SubmitRating endpoint will set the rating of the product.
 * @param {middleware} - server.middleware.https
*/
server.post('SubmitRating', server.middleware.https, function (req, res, next) {
    var response;
    try {
        var productID = req.querystring.pid;
        var queryRating = parseFloat(req.querystring.rating);
        var productRating = (queryRating > 0 && queryRating <= 5) ? queryRating : null;
        // Checks if the product id and product rating exists, else throws an error.
        if (productID && productRating) {
            var feedbackService = feedbackServices.setRating();
            var serviceRespone = feedbackService.call({ pid: productID, rating: productRating });
            // Checks is the response object is null, else throws an error.
            if (serviceRespone.object === null) {
                throw new Error(Resource.msg('error.msg.servicedown', 'productFeedback', null));
            }
            response = serviceRespone.object;
            // Sets the message according to the success status.
            response.message = response.success ? Resource.msg('response.success.msg', 'productFeedback', null) : Resource.msg('response.error.msg', 'productFeedback', null);
        } else {
            throw new Error(Resource.msg('error.msg.parametermissing', 'productFeedback', null));
        }
    } catch (error) {
        Logger.error('Error in ProductFeedback-SubmitRating endpoint: ' + error.message);
        response = {
            success: false,
            message: error.message
        };
    }
    res.json({
        response: response
    });
    next();
});

/**
 * ProductFeedback-Review: This ProductFeedback-Review endpoint will get the reviews from the third-party.
 * @param {middleware} - server.middleware.https
*/
server.get('Review', server.middleware.https, function (req, res, next) {
    var response;
    var productID;
    try {
        productID = req.querystring.pid;
        // Checks if the product id exists, else throws an error.
        if (productID) {
            var feedbackService = feedbackServices.getReview();
            var serviceRespone = feedbackService.call({ pid: productID });
            // Checks is the response object is null, else throws an error.
            if (serviceRespone.object === null) {
                throw new Error(Resource.msg('error.msg.servicedown', 'productFeedback', null));
            }
            response = serviceRespone.object;
        } else {
            throw new Error(Resource.msg('error.msg.parametermissing', 'productFeedback', null));
        }
    } catch (error) {
        Logger.error('Error in ProductFeedback-Review endpoint: ' + error.message);
        response = {
            success: false,
            error: error.message
        };
    }
    res.render('product/components/productReviews', {
        pid: productID,
        success: response.success,
        reviews: response.reviews
    });
    next();
});

/**
 * ProductFeedback-SubmitReview: This ProductFeedback-SubmitReview endpoint will set the reviews of the product.
 * @param {middleware} - server.middleware.https
*/
server.post('SubmitReview', server.middleware.https, function (req, res, next) {
    var renderTemplateHelper = require('*/cartridge/scripts/renderTemplateHelper');
    var template = 'product/components/reviewStatus';
    var context;
    var serviceStatus;
    var response;
    try {
        var productID = req.querystring.pid;
        // trims the review text and author text in case of any trailing spaces
        var productReview = req.querystring.review ? (req.querystring.review).trim() : null;
        var productAuthor = req.querystring.author ? (req.querystring.author).trim() : null;
        // Checks if the product id, product reveiw and product rating exists, else throws an error.
        if (productID && productReview && productAuthor) {
            var feedbackService = feedbackServices.setReview();
            var serviceRespone = feedbackService.call({ pid: productID, review: productReview, author: productAuthor });
            // Checks is the response object is null, else throws an error.
            if (serviceRespone.object === null) {
                throw new Error(Resource.msg('error.msg.servicedown', 'productFeedback', null));
            }
            response = serviceRespone.object;
            serviceStatus = response.success ? response.success : false;
            context = {
                status: serviceStatus
            };
        } else {
            // eslint-disable-next-line no-nested-ternary
            var msgKey = (!productID ? 'error.msg.productidmissing' : ((!productReview ? 'error.msg.reviewmissing' : (!productAuthor ? 'error.msg.authormissing' : null))));
            throw new Error(Resource.msg(msgKey, 'productFeedback', null));
        }
    } catch (error) {
        Logger.error('Error in ProductFeedback-Review endpoint: ' + error.message);
        context = {
            status: false
        };
        response = {
            success: false,
            error: error.message
        };
    }
    // passess the template and context to the getRenderedHtml function in the renderTemplateHelper helper file.
    var alertTemplateRender = renderTemplateHelper.getRenderedHtml(context, template);
    res.json({
        response: response,
        template: alertTemplateRender
    });
    next();
});

module.exports = server.exports();
