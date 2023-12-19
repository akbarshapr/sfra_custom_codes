'use strict';

var Logger = require('dw/system/Logger');
var Status = require('dw/system/Status');
var Resource = require('dw/web/Resource');
var OrderMgr = require('dw/order/OrderMgr');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');

/**
 * This function is responsible for sending out order confirmation email.
 * @function
 * @returns {string} Status - status of the Job.
*/
function processOrderDetails() {
    var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');
    var emailObj;
    var orderDetailsCO = CustomObjectMgr.getAllCustomObjects('ordersDetailsCO');
    if (!orderDetailsCO || orderDetailsCO.count === 0) {
        Logger.info('No custom object instances found in ordersDetailsCO');
        return new Status(Status.OK, 'NO_CUSTOM_OBJECTS_FOUND', 'No custom object instances found');
    }
    while (orderDetailsCO.hasNext()) {
        var customObjInstance = orderDetailsCO.next();
        var orderObjNumber = customObjInstance.custom.orderNo || null;
        var orderObjStatus = customObjInstance.custom.orderStatus || null;
        var order = OrderMgr.getOrder(orderObjNumber);
        switch (orderObjStatus) {
            case 'AUTHORIZED':
                order.addNote('Order Confirmation Email sent', null);
                order.setPaymentStatus(2);
                order.setExportStatus(2);
                emailObj = {
                    template: 'checkout/confirmation/confirmationEmail',
                    subject: Resource.msg('subject.order.confirmation.email', 'order', null)
                };
                break;
            case 'PROCESSING':
                break;
            case 'DECLINED':
                order.addNote('Order cancelled', null);
                OrderMgr.cancelOrder(order);
                emailObj = {
                    template: 'checkout/failed/failedEmail',
                    subject: Resource.msg('subject.order.failed.email', 'order', null)
                };
                break;
            default:
                Logger.info('No matching cases in the switch statement');
                break;
        }
        if (emailObj) {
            COHelpers.sendConfirmationEmail(order, order.customerLocaleID, emailObj);
        }
        CustomObjectMgr.remove(customObjInstance);
    }
    return new Status(Status.OK);
}

module.exports = {
    processOrderDetails: processOrderDetails
};
