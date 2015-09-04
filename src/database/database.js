var mysql  = require('mysql'),
    bcrypt = require('bcrypt'),
    pool   = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_BLOG,
        connectionLimit: 10,
        supportBigNumbers: true
    });

exports.CheckUserExists = function (username, callback) {
    var query = "SELECT * FROM users u WHERE u.username = ?;";
    
    queryDatabase(query, [username], callback);
};

exports.CreateNewUser = function (username, password, callback) {
    var query = "INSERT INTO users(`username`, `password`) VALUES (?, ?);",
        salt  = bcrypt.genSaltSync(10),
        hash  = bcrypt.hashSync(password, salt);

    queryDatabase(query, [username, hash], callback);
};

exports.GetPosts = function (count, callback) {
    var query = "SELECT * FROM posts p ORDER BY p.date DESC LIMIT ?;",
        count = count || 10;

    queryDatabase(query, [count], callback);
};

exports.CreateNewPost = function (title, content, author, callback) {
    var query = "INSERT INTO posts(`title`, `content`, `date`, `author`) " +
                "VALUES (?, ?, NOW(), ?);";

    queryDatabase(query, [title, content, author], callback);
};

function queryDatabase(query, data, callback) {
    pool.getConnection(function (poolErr, connection) {
        if (poolErr) {
            console.log(poolErr);
            callback(poolErr);
            return;
        }

        connection.query(query, data, function (connErr, results) {
            connection.release();
            if (connErr) {
                console.log(connErr);
                callback(connErr);
                return;
            }

            callback(false, results);
        });
    });
};
