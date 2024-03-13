const crypto = require('crypto');
const serialization = require('../util/serialization')

const memMap = new Map(); // names to objects

const mem = {
    put: function(user, key, callback) {
        try {
            if (key === null) {
                const hash = crypto.createHash('sha256');
                hash.update(serialization.serialize(user));
                const hashedValue = hash.digest('hex');
                memMap.set(user, hashedValue);
            } else {
                memMap.set(user, key);
            }
            callback(null, user);
        } catch(e) {
            callback(e, null);
        }
    },
    get: function(key, callback) {
        if (memMap.has(key)) {
            const value = memMap.get(key);
            callback(null, value); // No error, return the value
        } else {
            callback(new Error('Key not found'), null); // Key does not exist
        }
    },
    del: function(key, callback) {
        if (memMap.has(key)) {
            const value = memMap.delete(key);
            callback(null, value); // Successfully deleted, no error
        } else {
            callback(new Error('Key not found'), null); // Key does not exist
        }
    }
};

module.exports = mem;

