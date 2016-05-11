angular.module('helloWorldChat', [
    'ui.router',
    'angular-websql',
    'luegg.directives'
])
.config(['$urlRouterProvider', '$compileProvider', function ($urlRouterProvider, $compileProvider) {
    $urlRouterProvider.otherwise("/");
    
    var oldWhiteList = $compileProvider.imgSrcSanitizationWhitelist();
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
}])
.run(['$rootScope', '$state', function ($rootScope, $state) {
    console.log('helloWorldChat running...');
}]);