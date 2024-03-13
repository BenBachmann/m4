//  ________________________________________
// / NOTE: You should use absolute paths to \
// | make sure they are agnostic to where   |
// | your code is running from! Use the     |
// \ `path` module for that purpose.        /
//  ----------------------------------------
//         \   ^__^
//          \  (oo)\_______
//             (__)\       )\/\
//                 ||----w |
//                 ||     ||


const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const serialization = require('../util/serialization')

const storeDirectory = path.join(__dirname, 'store'); // Specify your storage directory
if (!fs.existsSync(storeDirectory)) {
    fs.mkdirSync(storeDirectory, { recursive: true });
}

const sanitizeKey = (key) => {
    // Remove non-alphanumeric characters to avoid issues with filenames
    let stringKey = String(key);
    return stringKey.replace(/[^a-z0-9]/gi, '_');
};

const generateHash = (value) => {
    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(value));
    return hash.digest('hex');
};

const store = {
    put: function(key, value, callback) {
        try {
            let effectiveKey = key === null ? generateHash(value) : sanitizeKey(key);
            let filePath = path.join(storeDirectory, effectiveKey);
            fs.writeFile(filePath, serialization.serialize(value), (err) => {
                if (err) {
                    callback(Error("error in put"), null);
                } else {
                    callback(null, key); // Success
                }
            });
        } catch (e) {
            callback(e, null);
        }
    },
    get: function(key, callback) {
        try {
            let filePath = path.join(storeDirectory, sanitizeKey(key));
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    callback(Error("error in get"), null);
                } else {
                    callback(null, JSON.parse(data)); // Success
                }
            });
        } catch (e) {
            callback(e, null);
        }
    },
    del: function(key, callback) {
        try {
            let filePath = path.join(storeDirectory, sanitizeKey(key));
            fs.unlink(filePath, (err) => {
                if (err) {
                    callback(Error("error in del"), null);
                } else {
                    callback(null, { message: "Deleted successfully" }); // Success
                }
            });
        } catch (e) {
            callback(Error("error in del 2"), null);
        }
    }
};

module.exports = store;
