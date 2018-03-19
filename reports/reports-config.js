angular.module('inklocker')

    .config([
        '$stateProvider', function ($stateProvider) {
            $stateProvider
                .state('reports', {
                    url: '/reports',
                    cache: false,
                    views: {
                        sidebar: {
                            templateUrl: 'partials/sidebar.html'
                        },
                        header: {
                            templateUrl: 'partials/header.html'
                        },
                        content: {
                            controller: 'ReportCtrl',
                            templateUrl: 'components/reports/reports.html'
                        }
                    }
                });
        }
    ]);
