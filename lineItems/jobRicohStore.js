const moment = require('moment'),
    mongoose = require('mongoose'),
    _ = require('lodash'),
    convert = require('../../../services/common/convert'),
    getCSV = require('./getCSV'),
    fs = require('fs'),
    s3 = require('../../../services/common/amazon');

module.exports = function () {
    const dateNow = moment(new Date()).format(),
        dateBack90days = moment(dateNow).startOf('date').subtract(90,"days").format(),
        beginPeriod = convert.dateToObjectId(dateBack90days),
        endPeriod = convert.dateToObjectId(dateNow);

    let aggregateUsers = [
            {$match:{stores:{$not:{$size:0}}}},
            { $unwind : { path: '$stores' }},
            {$project:{_id:1,stores:1,username:1,firstName:1,lastName:1}},
            {$lookup:{
                from: "stores",
                localField: "stores",
                foreignField: "_id",
                as: "store"
            }},
            {$project:{_id:1,stores:1,username:1,firstName:1,lastName:1,
                nameStore:{$arrayElemAt: [ "$store.name", 0 ]}
            }}
        ],
        aggregateOrders = [
            {
                $match:{
                    _id:{
                        $gte:beginPeriod,
                        $lte:endPeriod
                    }
                }
            },
            {$project:{_id:1,store:1}},
            {$group:{_id:'$store'}},
            {$project:{_id:'$_id',stores:'$_id',active:'true'}}
        ];

    Promise.all([
        mongoose.model('User').aggregate(aggregateUsers).allowDiskUse(true).exec(),
        mongoose.model('Orders').aggregate(aggregateOrders).allowDiskUse(true).exec()
    ]).then(r=>{
        let arrayUsers = r[0],
            arrayOrders = r[1],
            sourceArray = [];

        arrayUsers.forEach((item)=>{
            let active = _.get(_.find(arrayOrders,{stores:item.stores}),'active',false);
            sourceArray.push({
                product:{
                    store:{
                        _id:item.stores
                    }
                },
                'storeName':_.get(item,'nameStore'),
                user:{
                    _id:_.get(item,'_id'),
                    firstName:_.get(item,'firstName'),
                    lastName:_.get(item,'lastName'),
                },
                'active':active
            });
        });
        return sourceArray;
    }).then(source=>{
        let selectRaw = ['storeCreatedAt','storeName','userId','userFirstName','userLastName','active'],
            raw = source;
        return getCSV(raw,selectRaw)
    }).then(csv =>{
        if (!_.isNull(csv)){
            let sizeCsv= Buffer.byteLength(csv,'utf8');
            return s3.upload({
                body:new Buffer(csv),
                type:'text/csv',
                path:'',
                key:`store_report_90_${moment().format('YYYY_MM_DD_hh_mm_ss_SSS')}.csv`,
                size: _.round((sizeCsv/1000),2),
                option:{
                    type:'ricoh',
                    region:'us-west-2',
                    bucket:'inklocker-communication'
                }
            });
        }else{
            return {
                url: "Report not created because it is null!",
                size:0
            }
        }
    }).then(report=>{
        let info = {
                url:report.url,
                size:report.size
            };
        console.log(info);
    });
};