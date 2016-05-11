angular.module('helloWorldChat')
    .service('User', ['Database', '$q',
      function (Database, $q) {
       
        var self     = this;
        var deferred = null;
        
        self.id       = null;
        self.username = null;
        self.picture  = null;
        
        var UserModel = Database.table('users');

        self.login = function (name) {
            deferred = $q.defer();
            UserModel.findOneBy('username', name)
                .then(function (user) {
                    self.username = user.username;
                    self.picture = user.picture;
                    self.id = user.id;
                    localStorage.setItem('user', user.id);
                    deferred.resolve(self);
                }, function (res) {
                    deferred.reject('user not created...');
                });
            return deferred.promise;
        }

    }]);