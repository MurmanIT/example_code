const objectFields = require('./getFields'),
    csv = require('../../../services/common/index').export.csv,
    _ = require('lodash');

module.exports = function (raw,selectRaw) {
    return new Promise(function (resolve,reject) {
       let fieldsNames = getLabel(selectRaw),
           fields = getField(selectRaw),
           data = _.map(raw,(i)=>{
               return mappingClosure(i,fields)
           });


       if (data.length < 1){
           return resolve(null);
       }

       csv(data,fields,fieldsNames)
           .then(resolve)
           .catch(reject);
    });
};

function mappingClosure(item,fields) {
    let arrayElement = [];
    _.forEach(fields,(i)=>{
        arrayElement.push(
            ((_.isNull(objectFields[`${i}`].value)) ? _.get(item,objectFields[`${i}`].viewField,'') : objectFields[`${i}`].value(item))
        );
    });
    return _.zipObject(fields,arrayElement);
}

function getField(select) {
    let arrayField = [];
    arrayField.push('id');
    if (!_.isLength(select) && !_.eq(select.length,0)){
        _.forEach(select,(i)=>arrayField.push(i));
    }else{
        _.forIn(objectFields,(v,k)=>arrayField.push(`${k}`));
    }
    return _.uniq(arrayField);
}

function getLabel(select){
    let selectQuery = [];
    if (!_.isLength(select) && !_.eq(select.length,0)){
        selectQuery.push('LINEITEMS ID');
        _.forEach(select,(i)=>{
            if (!_.isNull(i)){
                selectQuery.push(objectFields[`${i}`].label);
            }
        });
    }else{
        _.forIn(objectFields,(v,k)=>{
            selectQuery.push(v.label);
        });
    }
    return _.map(_.uniq(selectQuery),(e)=>_.upperCase(e));
}