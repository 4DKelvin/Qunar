var fs = require('fs');
var walk = function (dir) {
    return new Promise(function (resolve, reject) {
        var results = [];
        fs.readdir(dir, function (err, list) {
            if (err) return reject(err);
            var i = 0;
            (function next() {
                var file = list[i++];
                if (!file) return resolve(results);
                file = dir + '/' + file;
                fs.stat(file, function (err, stat) {
                    if (stat && stat.isDirectory()) {
                        walk(file, function (err, res) {
                            results = results.concat(res);
                            next();
                        });
                    } else {
                        results.push(file);
                        next();
                    }
                });
            })();
        });
    });
};
module.exports = walk;