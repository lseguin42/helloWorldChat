angular.module('helloWorldChat')
    .config(function ($stateProvider) {
        $stateProvider
        .state('chat', {
            requireAuth: true,
            url: '/:username',
            templateUrl: 'views/chat/chat.html',
            controller: 'ChatCtrl',
            controllerAs: 'vm',
            resolve: {
                Auth: ['$stateParams', 'User', '$state', function ($stateParams, User, $state) {
                    return User.login($stateParams.username).catch(function (reson) {
                        $state.go('home');
                    });
                }]
            }
        })
    });