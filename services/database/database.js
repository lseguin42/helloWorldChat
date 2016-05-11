angular.module('helloWorldChat')
  .service('Database', ['$webSql', '$q', function ($webSql, $q) {
     var self = this;
    /** 
     * Create DB
     */
    var database = $webSql.openDatabase('helloWorldChatDB', '1.0', 'Test DB', 2 * 1024 * 1024);

    var tableUsers = 
            'CREATE TABLE users (' +
            '    id INTEGER not null primary key AUTOINCREMENT,' +
            '    username TEXT not null UNIQUE,' +
            '    picture TEXT not null' +
            ')';
    var tableMessages = 
            'CREATE TABLE messages (' +
            '    id INTEGER not null primary key AUTOINCREMENT,' +
            '    user_id INTEGER not null REFERENCES users(id),'  +
            '    text TEXT not null,' +
            '   date INTEGER not null' +
            ')';
    try {
       database.executeQuery(tableUsers);
       database.executeQuery(tableMessages);
    } catch ($e) {}
    
    self.table = function (tableName) {
        function where(column, value) {
            var filter = {};
            filter[column] = value;
            return filter;
        }
        
        return {
            
            findOneBy: function (column, value) {
                return database.select(tableName, where(column, value))
                       .then(function (res) {
                           if (res.rows.length !== 1)
                                return $q.reject("error");
                           return res.rows[0];
                       });
            },
            
            findBy: function (column, value) {
                return database.select(tableName, where(column, value))
                       .then(function (res) {
                           var t = [];
                           for (var i = 0; i < res.rows.length; i++)
                               t.push(res.rows[i]);
                           return t;
                       });
            },
            
            all: function () {
                return database.selectAll(tableName)
                       .then(function (res) {
                           var t = [];
                           for (var i = 0; i < res.rows.length; i++)
                               t.push(res.rows[i]);
                           return t;
                       });
            },
            
            insert: function (datas) {
                return database.insert(tableName, datas)
                        .then(function (res) {
                            return res.insertId;
                        });
                
            }
            
        }
    }
    
  }]);