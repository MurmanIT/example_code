const  _ = require('lodash'),
    getData = require('./getData'),
    getCSV = require('./getCSV'),
    moment = require('moment'),
    fs = require('fs'),
    s3 = require('../../../services/common/amazon');
/**
 * reqBody = {
 *      filter:{
 *          createDate:{
 *          start: '2017-12-13',
 *          end: '2017-12-14'
 *          }
 *      },
 *      select:["id", "itemsInOrder"...]
 * }
 * pathButket = 'reports/adhoc'
 * @param reqBody
 * @param configS3
 * @param nameCSV
 */
module.exports = function (reqBody={},configS3={path:''},nameCSV='') {
    let filterRaw = _.get(reqBody,'filter'),
        selectRaw = _.get(reqBody,'select',null),
        tmpFilter = {
            createdDate:_.get(filterRaw,'createdDate',null),
            purchaseDate:_.get(filterRaw,'purchaseDate',null),
            postageDate:_.get(filterRaw,'postageDate',null),
            shipmentDate:_.get(filterRaw,'shipmentDate',null),
            printshop:_.get(filterRaw,'printshop',null),
            store:_.get(filterRaw,'store',null)
        },
        startTime = new Date(),
        pathButket = _.get(configS3,'path'),
        optionsS3 = _.get(configS3,'options',null);

    return getData(tmpFilter,selectRaw)
        .then(querySelect=>{
            return getCSV(
                _.get(querySelect,'raw',[]),
                _.get(querySelect,'selectRaw',[])
            )
        })
        .then(csv =>{
            if (!_.isNull(csv)){
                let sizeCsv= Buffer.byteLength(csv,'utf8');
                return s3.upload({
                    body:new Buffer(csv),
                    type:'text/csv',
                    path:pathButket,
                    key:`${nameCSV}${moment().format('YYYY_MM_DD_hh_mm_ss_SSS')}.csv`,
                    size: _.round((sizeCsv/1000),2),
                    option:optionsS3
                });
            }else{
                return {
                    url: "Report not created because it is null!",
                    size:0
                }
            }
        })
        .then(report=>{
            let endTime = new Date();
            return {
                url:report.url,
                size:report.size,
                created:_.round((moment(endTime).diff(startTime)/60),2)
            };
        })
        .catch(err=>console.error(err));
};

