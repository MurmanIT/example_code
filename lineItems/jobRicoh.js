const moment = require('moment'),
    _ = require('lodash'),
    getReport = require('./getReport');

module.exports = function () {
    const dateNow = moment(new Date()).format(),
        dateBack3Hour = moment(dateNow).subtract(3,"hours").format();

    let query = {
            filter: {
                createdDate: {
                    start: dateBack3Hour,
                    end: dateNow
                }
            }
        },
        report = [
            {
                name: 'lineitem_report_',
                select: ['id', 'purchaseDate', 'productId', 'productName',
                    'productBlackName',
                    'productBlankStyleName',
                    'productBlankColorName',
                    'productBlankSizeName',
                    'orderId',
                    'orderServiceId',
                    'blankPrice',
                    'printshopFee',
                    'printshopId',
                    'printshop',
                    'storeName',
                    'userEmail',
                    'latestCreatedAt',
                    'acceptedOffer',
                    'pretreatmentDate',
                    'printStartDate',
                    'shipmentDate'
                ],
            },
            { //store Id ?
                name: 'store_report_',
                select: ['storeCreatedAt','storeName',
                    'userId', 'userFirstName',
                    'userLastName', 'orderCreatedAt']
            },
            {
                name: 'printshop_report_',
                select: ['printshopId', 'printshop', 'prithshopCreatedAt','clientCity','clientState','clientCountry']
            }
        ];
        listReport = _.map(report,(e)=>{
            let config_s3 = {
                path:'',
                options:{
                    type:'ricoh',
                    region:'us-west-2',
                    bucket:'inklocker-communication/test_report'
                }
            };
            return getReport({
                filter:query.filter,
                select:e.select
            },config_s3,e.name);
        });

    return Promise.all(listReport);
};
