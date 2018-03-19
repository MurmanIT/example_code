'use strict';
const _ = require('lodash'),
    moment = require('moment'),
    getPrice = require('../../../services/products/getPrice'),
    getBlankPrice = require('../../../services/products/getBlankPrice'),
    convert = require('../../../services/common/convert'),
    Utils = require('../../../services/common');

module.exports = {
        id: {
            label: "LINEITEMS ID",
            viewField: "_id",
            value: null
        },
        createAt: {
            label: "CREATED DATE",
            viewField: "_id",
            value: (item) => convert.UTCtoISO(convert.objectIdToDate(_.get(item, '_id', '')))
        },
        purchaseDate: {
            label: "PURCHASE DATE",
            viewField: "purchaseDate",
            value: (item) => convert.UTCtoISO(_.get(item, 'purchaseDate', ''))
        },
        sourceLineItemId: {
            label: "SOURCE LINE ITEM ID",
            viewField: "sourceLineItemId",
            value: null
        },
        productId: {
            label: "PRODUCT ID",
            viewField: "productId",
            value: null
        },
        sourceProductId: {
            label: "SOURCE PRODUCT ID",
            viewField: "sourceProductId",
            value: null
        },
        productName: {
            label: "PRODUCT NAME",
            viewField: "productName",
            value: null
        },
        orderId: {
            label: "ORDER ID",
            viewField: "orderId",
            value: null
        },
        storeName: {
            label: "STORE",
            viewField: "storeName",
            value: null
        },
        orderServiceId: {
            label: "ORDER SERVICE ID",
            viewField: "orderServiceId",
            value: null
        },
        orderSourceName: {
            label: "ORDER SOURCE NAME",
            viewField: "orderSourceName",
            value: null
        },
        itemsInOrder: {
            label: "ORDER QTY",
            viewField: "itemsInOrder",
            value: null
        },
        productBlackName: {
            label: "BLANK BRAND",
            viewField: "productBlackName",
            value: null
        },
        productBlankStyleName: {
            label: "BLANK STYLE",
            viewField: "productBlankStyleName",
            value: null
        },
        productBlankColorName: {
            label: "BLANK COLOR",
            viewField: "productBlankColorName",
            value: null
        },
        productBlankSizeName: {
            label: "BLANK SIZE",
            viewField: "productBlankSizeName",
            value: null
        },
        blankPrice: {
            label: "BLANK PRICE",
            viewField: "product",
            value: (item) => getBlankPrice(_.get(item, 'product')).total
        },
        underbase: {
            label: "UNDERBASE",
            viewField: "underbase",
            value: null
        },
        underbaseFee: {
            label: 'UNDERBASE FEE',
            viewField: ["underbase","orderSourceName"],
            value: (item) => {
                let underbase = _.get(item, 'underbase'),
                    orderSourceName = _.get(item,'orderSourceName');
                if (orderSourceName === 'zazzle'){
                    return (!_.isNull(underbase)) ? ((underbase === 'yub') ? 2 : 0 ) : '';
                }else{
                    return '';
                }

            }
        },
        fulfillmentFeeFront: {
            label: "FULFILLMENT FRONT",
            viewField: "product",
            value: (item) => _.get(getPrice(_.get(item, 'product')).fulfillmentFee, 'front')
        },
        fulfillmentFeeBack: {
            label: "FULFILLMENT BACK",
            viewField: "product",
            value: (item) => _.get(getPrice(_.get(item, 'product')).fulfillmentFee, 'back')
        },
        totalFulfillmentFee: {
            label: "TOTAL FULFILLMENT FEE",
            viewField: "product",
            value: (item) => _.get(getPrice(_.get(item, 'product')).fulfillmentFee, 'total')
        },
        latestOfferAffiliateName: {
            label: "AFFILIATE NAME",
            viewField: "latestOfferAffiliateName",
            value: null
        },
        latestOfferAffiliateFee: {
            label: "AFFILIATE FEE",
            viewField: "latestOfferAffiliateFee",
            value: null
        },
        orderShippingRate: {
            label: "SHIPPING RATE",
            viewField: "orderShippingRate",
            value: null
        },
        orderShippingMarkup: {
            label: "SHIPPING MARKUP",
            viewField: "orderShippingMarkup",
            value: null
        },
        inklockerFee: {
            label: "INKLOCKER FEE",
            viewField: "latestOfferInklockerFee",
            value: (item) => _.round(_.get(item, 'latestOfferInklockerFee', 0), 2)
        },
        inklockerFeeTotal: {
            label: "INKLOCKER FEE TOTAL",
            viewField: "latestOfferInklockerFeeTotal",
            value: (item) => _.round(_.get(item, 'latestOfferInklockerFeeTotal', 0), 2)
        },
        discount: {
            label: "DISCOUNT",
            viewField: "orderDiscount",
            value: null
        },
        subtotal: {
            label: "SUBTOTAL",
            viewField: "orderSubtotal",
            value: (item) => _.round(_.get(item, 'orderSubtotal', 0), 2)
        },
        total: {
            label: "TOTAL",
            viewField: "orderTotal",
            value: (item) => _.round(_.get(item, 'orderTotal', 0), 2)
        },
        printshop: {
            label: "PRINTSHOP",
            viewField: "clientName",
            value: null
        },
        printshopId: {
            label: "PRINTSHOP ID",
            viewField: "clientId",
            value: null
        },
        offerStatus: {
            label: "OFFER STATUS",
            viewField: "offerStatus",
            value: null
        },
        grossRevenue: {
            label: "GROSS REVENUE",
            viewField: "latestOfferGrossRevenue",
            value: (item) => _.round(_.get(item, 'latestOfferGrossRevenue', 0), 2)
        },
        grossRevenueTotal: {
            label: "GROSS REVENUE TOTAL",
            viewField: "latestOfferGrossRevenueTotal",
            value: (item) => _.round(_.get(item, 'latestOfferGrossRevenueTotal', 0), 2)

        },
        firstName: {
            label: "FIRST NAME",
            viewField: "shippingFirstName",
            value: null
        },
        lastName: {
            label: "LAST NAME",
            viewField: "shippingLastName",
            value: null
        },
        shippingAddressLine1: {
            label: "ADDRESS 1",
            viewField: "shippingAddressLine1",
            value: null
        },
        shippingAddressLine2: {
            label: "ADDRESS 2",
            viewField: "shippingAddressLine2",
            value: null
        },
        shippingAddressLine3: {
            label: "ADDRESS 3",
            viewField: "shippingAddressLine3",
            value: null
        },
        city: {
            label: "CITY",
            viewField: "shippingCity",
            value: null
        },
        state: {
            label: "STATE",
            viewField: "shippingState",
            value: null
        },
        postcode: {
            label: "POSTCODE",
            viewField: "shippingPostcode",
            value: null
        },
        country: {
            label: "COUNTRY",
            viewField: "shippingCountry",
            value: null
        },
        phone: {
            label: "PHONE",
            viewField: "shippingPhone",
            value: null
        },
        trackingCarrier: {
            label: "CARRIER",
            viewField: "postageTrackingCarrier",
            value: null
        },
        trackingNumber: {
            label: "TRACKING NUMBER",
            viewField: "postageTrackingNumber",
            value: null
        },
        postageUpdated: {
            label: "POSTAGE DATE",
            viewField: "postageUpdated",
            value: (item) => convert.UTCtoISO(_.get(item, 'postageUpdated', ''))
        },
        receivedJobDate: {
            label: "RECEIVED JOB DATE",
            viewField: ["orderAcceptedOffer", "orderLatestOfferStatus", "orderLatestOfferUpdate"],
            value: function (item) {
                let receivedJobDate = null;
                if (_.get(item, 'orderAcceptedOffer') && _.get(item, 'orderLatestOfferStatus') == 'accepted') {
                    receivedJobDate = _.get(item, 'orderLatestOfferUpdate');
                }
                return convert.UTCtoISO(receivedJobDate || '');
            }
        },
        printStartDate: {
            label: "PRINT START DATE",
            viewField: ["timestampsPrintingFront", "timestampsPrintingBack"],
            value: function (item) {
                let printingFrontDate = _.get(item, 'timestampsPrintingFront'),
                    printingBackDate = _.get(item, 'timestampsPrintingBack'),
                    printStartDate;

                if (printingFrontDate && printingBackDate) {
                    printStartDate = moment.max(moment(printingFrontDate), moment(printingBackDate)).format();
                } else {
                    printStartDate = printingFrontDate || printingBackDate;
                }
                return convert.UTCtoISO(printStartDate || '');
            }
        },
        shipmentDate: {
            label: "SHIPMENT DATE",
            viewField: "shipmentDate",
            value: (item) => convert.UTCtoISO(_.get(item, 'shipmentDate', ''))
        },
        processingTimeTotal: {
            label: "PROCESSING TIME TOTAL",
            viewField: ["purchaseDate","orderAcceptedOffer","orderLatestOfferStatus","orderLatestOfferUpdate"],
            value: function (item) {
                let orderDate = _.get(item, 'purchaseDate'),
                    receivedJobDate = null;
                if (_.get(item, 'orderAcceptedOffer') && _.get(item, 'orderLatestOfferStatus') == 'accepted') {
                    receivedJobDate = _.get(item, 'orderLatestOfferUpdate');
                }

                return Utils.time.difference(orderDate, receivedJobDate);
            }
        },
        manufacturingTimeTotal: {
            label: "MANUFACTURING TIME TOTAL",
            viewField: ["postageUpdated","orderAcceptedOffer","orderLatestOfferStatus","orderLatestOfferUpdate"],
            value: function (item) {
                let shippmentDate = _.get(item, 'postageUpdated'),
                    receivedJobDate = null;
                if (_.get(item, 'orderAcceptedOffer') && _.get(item, 'orderLatestOfferStatus') == 'accepted') {
                    receivedJobDate = _.get(item, 'orderLatestOfferUpdate');
                }

                return Utils.time.difference(receivedJobDate, shippmentDate);
            }
        },
        orderCreatedAt:{
            label: "ORDER CREATED DATE",
            viewField: "orderId",
            value: (item) => convert.UTCtoISO(convert.objectIdToDate(_.get(item, 'orderId', null)))
        },
        latestCreatedAt:{
            label:"OFFER CREATE DATE", //offerMadeDate
            viewField: "latestOfferCreatedAt",
            value: (item) => convert.UTCtoISO(_.get(item, 'latestOfferCreatedAt', ''))
        },
        acceptedOffer:{
            label:"OFFER ACCEPT DATE",
            viewField: "orderAcceptedOffer",
            value: (item) => convert.UTCtoISO(convert.objectIdToDate(_.get(item, 'orderAcceptedOffer', null)))
        },
        printshopFee:{
            label:"PRINTSHOP FEE",
            viewField:["product","latestOfferInklockerFee"],
            value:function (item) {
                let fulfillmentFeeFront = _.get(getPrice(_.get(item, 'product')).fulfillmentFee, 'front'),
                    fulfillmentFeeBack = _.get(getPrice(_.get(item, 'product')).fulfillmentFee, 'back'),
                    inklockerFee = _.round(_.get(item, 'latestOfferInklockerFee', 0), 2);

                return  _.round(
                    ((fulfillmentFeeFront + fulfillmentFeeBack) - inklockerFee),2);
            }
        },
        blanksSuppliedBy:{
            label: "BLANKS SUPPLIED BY",
            viewField: "blanksSuppliedBy",
            value: null
        },
        prithshopCreatedAt: {
            label: "PRINTSHOP CREATE DATE",
            viewField: "clientId",
            value: (item) => convert.UTCtoISO(convert.objectIdToDate(_.get(item, 'clientId', null)))
        },
        pretreatmentDate:{
            label: "PRE-TREATMENT DATE",
            viewField: "pretreatmentDate",
            value: (item) => convert.UTCtoISO(_.get(item, 'pretreatmentDate', ''))
        },
        userId:{
            label: "USER ID",
            viewField: "user",
            value:(item) => _.get(item,'user._id','')
        },
        userFirstName:{
            label: "USER FIRST NAME",
            viewField: "user",
            value:(item) => _.get(item,'user.firstName','')
        },
        userLastName:{
            label: "USER LAST NAME",
            viewField: "user",
            value:(item) => _.get(item,'user.lastName','')
        },
        userEmail:{
            label: "USER EMAIL",
            viewField: "user",
            value:(item) => _.get(item,'user.username','')
        },
        retailPrice:{
            label: "RETAIL PRICE",
            viewField: "retailPrice",
            value:null
        },
        storeCreatedAt:{
            label: "STORE CREATED DATE",
            viewField: "product",
            value: (item) => convert.UTCtoISO(convert.objectIdToDate(_.get(item, 'product.store._id', null)))
        },
        clientCountry:{
            label: "PRINTHSHOP COUNTRY",
            viewField: "product",
            value: (item) => _.get(item,'product.client.address.country','United States')
        },
        clientState:{
            label: "PRINTHSHOP STATE",
            viewField: "product",
            value: (item) => _.get(item,'product.client.address.state','')
        },
        clientCity:{
            label: "PRINTHSHOP CITY",
            viewField: "product",
            value: (item) => _.get(item,'product.client.address.city','')
        },
        active:{
            label: "ACTIVE",
            viewField: "active",
            value:null
        }

}