angular.module('helloWorldChat')
    .controller('ChatCtrl', ['$scope', 'Chat', 'User', function ($scope, Chat, User) {
        
        $scope.message = "";
        $scope.Chat = Chat;
        $scope.User = User;
        $scope.currentDetails = -1;
        $scope.autoScroll = true;
        
        $scope.isSameNext = function (index) {
            if (index + 1 < $scope.Chat.messages.length)
                return $scope.Chat.messages[index].user_id == $scope.Chat.messages[index + 1].user_id;
            return false;
        }
        
        $scope.sendMessage = function () {
            if ($scope.message == "")
                return ;
            Chat.send($scope.message);
            $scope.message = "";
        }
        
        $scope.toggleDetails = function (indexMessage) {
            if ($scope.currentDetails == indexMessage)
                $scope.currentDetails = -1;
            else
                $scope.currentDetails = indexMessage;
        }
       
        $scope.$on("$destroy", function () {
            console.log('DESTROY EVENT');
        });
    }]);