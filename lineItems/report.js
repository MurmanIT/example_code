const getReport = require('./getReport');

module.exports = function (req,res,next) {
    let reqBody = req.body,
        config_s3 = {
            path:'reports/adhoc'
        };
    getReport(reqBody,config_s3)
        .then(report=>{
            res.json(report)
        }).catch(next);
};

