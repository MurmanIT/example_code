'use strict';

const _ = require('lodash'),
    convert = require('../../../services/common/convert'),
    LineItemsRepository = require('../../../repositories/lineitem/index').db,
    mongoose = require('mongoose'),
    moment = require('moment'),
    objectFields = require('./getFields');

module.exports = function (filter, select) {
    return mapRequestData(filter, select)
    // 2. Get LineItems data
        .then(getLineItems);
};

function mapRequestData(filter, selectRaw) {
    return new Promise(function (resolve, reject) {
        let select = getFields(selectRaw),
            query = getQuery(filter);
        resolve({
            query: _.get(query,'query'),
            select: select,
            selectRaw: selectRaw,
            sort:_.get(query,'sort')
        });
    });
}

function getLineItems(request) {
    return new Promise(function (resolve, reject) {
        LineItemsRepository.findFull(
            _.get(request, 'query', {}),
            _.get(request, 'select'),
            _.get(request,'sort',{'_id':-1})
        )
            .then(function (lineItems) {
                return resolve({
                    raw: lineItems,
                    selectRaw: _.get(request, 'selectRaw', [])
                });
            })
            .catch(reject);
    });
}

function getQuery(filter) {
    let queryFields = [],
        sortByDate = {'_id':-1},
        dateFromTo = function (value) {
            let from = _.get(value, 'start'),
                to = _.get(value, 'end');
            if (_.isNil(from) || !from.length) {
                from = moment('2015-01-01').format()
            }
            if (_.isNil(to) || !to.length) {
                to = moment().format();
            }
            return {
                from: from,
                to: to
            };
        };

    _.flatMap(filter, (v, k) => {
        if (!_.isNil(v) && !_.isUndefined(k)) {
            let push;
            switch (k) {
                case 'createdDate': {
                    let timefrom = moment(dateFromTo(v).from).format(),
                        timeto = moment(dateFromTo(v).to).format();
                    queryFields.push({
                        _id: {$gte: convert.dateToObjectId(timefrom)}
                    });
                    push = {
                        _id: {$lte: convert.dateToObjectId(timeto)}
                    };
                }
                    break;
                case 'purchaseDate': {
                    queryFields.push({
                        'purchaseDate': {$gt: new Date(dateFromTo(v).from)}
                    });
                    push = {
                        'purchaseDate': {$lt: new Date(dateFromTo(v).to)}
                    };
                    sortByDate = {'purchaseDate':-1};
                }
                    break;
                case 'shipmentDate': {
                    queryFields.push({
                        'shipmentDate': {$gt: new Date(dateFromTo(v).from)}
                    });
                    push = {
                        'shipmentDate': {$lt: new Date(dateFromTo(v).to)}
                    };
                    sortByDate = {'shipmentDate':-1};
                }
                    break;
                case 'postageDate': {
                    queryFields.push({
                        'postageUpdated': {$gt: new Date(dateFromTo(v).from)}
                    });
                    push = {
                        'postageUpdated': {$lt: new Date(dateFromTo(v).to)}
                    };
                    sortByDate = {'postageUpdated':-1};
                }
                    break;
                case 'printshop': {
                    push = {
                        'clientId': mongoose.Types.ObjectId(`${v}`)
                    };
                }
                    break;
                case 'store': {
                    if (_.isArray(v)){
                        let arrayObjectId = _.map(v,(e)=>{
                            return mongoose.Types.ObjectId(`${e}`)
                        });
                        push = {
                            'product.store._id': {
                                $in:arrayObjectId
                            }
                        };
                    }else{
                        push = {
                            'product.store._id': mongoose.Types.ObjectId(`${v}`)
                        };
                    }
                }
                    break;
            }
            queryFields.push(push);
        }
    });
    return{
        query:{
            $and: queryFields
        },
        sort:sortByDate
    };
}

function getFields(select) {
    let arraySelect = {};

    if (!_.isLength(select) && !_.eq(select.length, 0)) {

        let selectQuery = [];

        _.forEach(select, (i) => {
            if (!_.isNull(i)) {
                if (_.isArray(objectFields[`${i}`].viewField)) {
                    _.forEach(objectFields[`${i}`].viewField, (j) => {
                        selectQuery.push(j);
                    });
                } else {
                    selectQuery.push(objectFields[`${i}`].viewField);
                }
            } else {
                selectQuery.push('_id');
            }
        });
        arraySelect = _.zipObject(_.uniq(selectQuery), _.fill(selectQuery, 1));
    }else{
        return (new Error('Select null!! function getFields'));
    }
    return arraySelect;
}

