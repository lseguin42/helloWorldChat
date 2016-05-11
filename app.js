angular.module('helloWorldChat', [
    'ui.router',
    'angular-websql',
    'luegg.directives'
])
.config(['$locationProvider', '$urlRouterProvider', '$compileProvider', function ($locationProvider, $urlRouterProvider, $compileProvider) {
    $urlRouterProvider.otherwise("/");
    /*
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    */
    var oldWhiteList = $compileProvider.imgSrcSanitizationWhitelist();
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
}])
.run(['$rootScope', '$state', function ($rootScope, $state) {
    console.log('helloWorldChat running...');
}]);