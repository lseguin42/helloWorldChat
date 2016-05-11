angular.module('helloWorldChat')
  .service('Chat', ['User', '$window', '$rootScope', 'Database', '$q',
    function (User, $window, $rootScope, Database, $q) {
        
        var self      = this;
        self.users    = {};
        self.messages = [];
        
        var UserModel    = Database.table('users');
        var MessageModel = Database.table('messages');
        
        UserModel.all().then(function (users) {
            users.forEach(function (user) {
                self.users[user.id] = user;
            });
        });
        MessageModel.all().then(function (messages) {
            messages.forEach(function (message) {
                self.messages.push(message);
            });
        });
        
        function b64toBlob(b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;

            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, {type: contentType});
            return blob;
        }

        $window.addEventListener('storage', function (event) {
            var id = event.newValue;
            
            switch (event.key) {
                case 'user':
                    UserModel.findOneBy('id', id)
                      .then(function (user) {
                        self.users[user.id] = user;
                    });
                    break ;
                case 'message':
                    MessageModel.findOneBy('id', id)
                      .then(function (message) {
                        self.messages.push(message);
                    });
                    break ;
                default:
                    return ;
            }
        });
        
        self.pictureOf = function (user_id) {
            if (!self.users[user_id].url) {
                var blob = b64toBlob(self.users[user_id].picture.replace('data:image/png;base64,', ''));
                self.users[user_id].url = URL.createObjectURL(blob);
            }
            return self.users[user_id].url;
        }
        
        self.usernameOf = function (user_id) {
            return self.users[user_id].username;
        }
        
        self.send = function (text) {
            var message = {
                'user_id': User.id,
                'text': text,
                'date': Date.now()
            };
            MessageModel.insert(message)
              .then(function (id) {
                message.id = id;
                self.messages.push(message);
                localStorage.setItem('message', id);
            });
        }
        
    }]);