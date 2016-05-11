angular.module('helloWorldChat')
    .config(['$stateProvider', function ($stateProvider) {
        
        $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'views/home/home.html',
            controller: 'HomeCtrl',
            controllerAs: 'vm'
        })
    }]);