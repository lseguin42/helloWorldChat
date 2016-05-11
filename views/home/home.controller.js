angular.module('helloWorldChat')
    .controller('HomeCtrl', ['$state', '$scope', 'Database',
    function ($state, $scope, Database) {        
        
        var UserModel = Database.table('users');
        
        var pictureSettedCropper = false;
        
        $scope.loading = false;
        $scope.username = "";
        $scope.picture = null;
        
        $scope.crop = function () {
            pictureSettedCropper = true;
        }
        
        $scope.perform = function () {
            var username = $scope.username.toLowerCase();
            UserModel.insert({
                username: username,
                picture: $scope.picture
            }).finally(function () {
                $state.go('chat', { username: username });
            });
        }
        
        $scope.$watch('username', function update(newValue) {
            if (pictureSettedCropper)
                return ;
            if (newValue == null || newValue == "") {
                $scope.picture = null;
                return ;
            }
            if ($scope.loading)
                return ;
            $scope.loading = true;
            UserModel.findOneBy('username', newValue.toLowerCase())
              .then(function (user) {
                  $scope.picture = user.picture;
              })
              .catch(function () {
                  $scope.picture = null;
              })
              .finally(function () {
                  $scope.loading = false;
                  if ($scope.username != newValue)
                      update($scope.username);
              });
        });

    }]);