(function(angular,Inklocker){
    'use strict';
    var ReportCtrl = function ($scope,ReportsService,UserService) {
        $scope.isLoadingTransactions = true;
        $scope.summary = {};
        $scope.filters = {};
        $scope.selection = [];
        $scope.showDownload = false;
        $scope.showErrorMsg = false;
        $scope.showDropdownStore = false;
        $scope.storeList = [];

        $scope.calendars = {
            from: {
                isOpen: false,
                options: {
                    maxDate: $scope.filters.toDate,
                    showWeeks: false
                }
            },
            to: {
                isOpen: false,
                options: {
                    minDate: $scope.filters.fromDate,
                    showWeeks: false
                }
            }
        };

        init();

        function init() {
            $scope.typeDate = ReportsService.getTypeDate();
            $scope.fields = ReportsService.getFieldDate();
        }

        $scope.getPrintshops = function(input) {
            return getUsers(input,'client');
        };

        $scope.getStores = function(input) {
            return getUsers(input,'store');
        };

        $scope.$watch('fields|filter:{selected:true}',function (nv) {
            $scope.selection = nv.map(function (field) {
               return field.code;
            });
        },true);

        $scope.selectAllFields = function () {
            angular.forEach($scope.fields,function (item) {
               item.selected = true;
            });
        };

        $scope.clearAllFields = function () {
            angular.forEach($scope.fields,function (item) {
                item.selected = false;
            });
        };

        $scope.clearAll = function () {
            $scope.filters.printshop = null;
            $scope.filters.typeDate = null;
            $scope.filters.fromDate = null;
            $scope.filters.toDate = null;
            $scope.filters.store = null;
            $scope.filters.storeList = null;
            $scope.showDropdownStore = false;
        }

        $scope.onChangeUser = function() {};

        $scope.onChangeSUser = function () {
            $scope.showDropdownStore = false;
            $scope.filters.storeList = null;
        }
        $scope.onChangeStoreUser = function() {
            $scope.showDropdownStore = true;
            $scope.storeList = [];

            var storeArray = _.get($scope.filters.store,'stores',[]),
                allId = _.map(storeArray,function (e) {
                    return _.get(e,'_id')
                });

            $scope.storeList.push({
               name:'All',
               id:allId
            });

            _.map(storeArray,function (e) {
                $scope.storeList.push({
                    name:_.get(e,'name'),
                    id:_.get(e,'_id')
                });
            });
        };

        $scope.onExport = function () {
            var request = {
                filter:{},
                select:$scope.selection
            },
            filters = $scope.filters,
            typeDate = _.get(filters,'typeDate',null),
            codeDate = _.get(typeDate,'id',null),
            fromDate = _.get(filters,'fromDate',null),
            toDate =  _.get(filters,'toDate',null),
            printshop = _.get(filters,'printshop.client._id',null),
            store = _.get(filters,'store',null),
            storeList = _.get(filters,'storeList',null),
            flagError = false;

            $scope.showDownload = false;
            $scope.showErrorMsg = false;

            if (!_.isNull(store)){
                if (store === ''){ store = null;}else{
                if (!_.isNull(storeList)){
                    request.filter.store = _.get(storeList,'id');
                }else{
                    $scope.showErrorMsg = true;
                    $scope.errorMsg = "Need store";
                    flagError = true;
                }}
            }

            if (!_.isNull(printshop)){ request.filter.printshop = printshop; }
            if(!_.isNull(codeDate)){
                request.filter[codeDate] = {};
                if (!_.isNull(fromDate)){ request.filter[codeDate].start = fromDate;}
                if(!_.isNull(toDate)){request.filter[codeDate].end = toDate;}
                if (_.isNull(toDate) && _.isNull(fromDate)){
                    $scope.showErrorMsg = true;
                    $scope.errorMsg = "You need to set the date";
                    flagError = true;
                }
                if (_.isEqual(fromDate,toDate)){
                    var endDate = new Date(toDate),
                        endDateLast = new Date(endDate.getTime() + 1439*60000);

                    request.filter[codeDate].end = endDateLast.toString();
                }
            }else{
                $scope.showErrorMsg = true;
                $scope.errorMsg = "You need to set the type of date";
                flagError = true;
            }
            if (!flagError){
                ReportsService.report(request)
                    .then(function (res) {
                        $scope.showDownload = true;
                        $scope.donwloadUrl = res.url;
                        $scope.createTime = res.created;
                        $scope.sizeFile = res.size;
                    })
                    .catch(function (err) {
                        $scope.showErrorMsg = true;
                        $scope.errorMsg = err;
                    });
            }
        }
        function getUsers(input,type) {
            $scope.loadingUsers = true;
            return UserService.getUsers({
                type: type,
                q: input
            })
                .then(function (users) {
                    return users;
                })
                .catch(function(err) {
                    var errorMsg = err.data.message || err.data;
                    swal({
                        title: "Something's Wrong",
                        text: "We're unable to create a transaction at this time because " + errorMsg,
                        type: "error"
                    });
                })
                .finally(function() {
                    $scope.loadingUsers = false;
                });
        }

        $scope.openCalendar = function(e, name) {
            e.preventDefault();
            e.stopPropagation();
            $scope.calendars[name].isOpen = true;
        };

        // destroy watcher
        $scope.$on('$destroy', function() {
            unwatchMinMaxValues();
        });

        // watch min and max dates
        var unwatchMinMaxValues = $scope.$watch(function() {
            return [$scope.filters.fromDate, $scope.filters.toDate];
        }, function() {
            // min max dates
            $scope.calendars.from.options.maxDate = $scope.filters.toDate;
            $scope.calendars.to.options.minDate = $scope.filters.fromDate;
        }, true);

        //Preset
        $scope.presetZazzle = function () {
            var presetArray = ReportsService.getPreset('zazzle'),
                nowDate = moment();
            angular.forEach($scope.fields,function (item) {
                if (_.find(presetArray,function(e){
                        return (e == item.code)
                    })){
                    item.selected = true;
                }
            });
            $scope.filters.toDate = new Date(nowDate.format());
            $scope.filters.fromDate = new Date(nowDate.subtract(7,"days"));
            $scope.filters.typeDate = {name:'Created Date', id:'createdDate'};
        };
    };

    Inklocker.controller('ReportCtrl', ['$scope','ReportsService','UserService',ReportCtrl])

        .run(['$templateCache', function ($templateCache) {
            $templateCache.put(
                'typeahead-res-store.tpl.html',
                '<div ng-init="result = (match.model.name)">' +
                '<span class="search-result" ng-bind-html="result | uibTypeaheadHighlight:query"></span></div>'
            );
        }])

        .run(['$templateCache', function ($templateCache) {
            $templateCache.put(
                'typeahead-res-user.tpl.html',
                '<div ng-init="result = (match.model.name)">' +
                '<span class="search-result"  ng-bind-html="result | uibTypeaheadHighlight:query"></span></div>'
            );
        }]);

})(angular, Inklocker);
