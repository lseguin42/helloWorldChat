angular.module('helloWorldChat')
.filter('blob', [function() {
    return function(blob) {
      return URL.createObjectURL(blob);
    }
}]);