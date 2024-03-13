const crypto = require('crypto');
const http = require('http');
const serialization = require('./serialization');
const utils = require('./utils');

let context = {};

const nodes = distribution.local.groups.get("all", console.log);
const nidList = status.get("nid", console.log);

utils.naiveHash = (kid, nids) => { nids.sort(); nids[utils.idToNum(kid) % nids.length] }

const mem = (config) => {
  context.gid = config.gid || "all";
  context.hash = config.hash || utils.naiveHash; 
  const getKID = (key) => utils.sha256(key);

  return {
    get: (key, callback) => {
        const kid = getKID(key);
        const nodeId = context.hash(kid, nidList);
        const remote = {
            node: nodes[nodeId],
            service: 'mem',
            method: 'get'
        };
        const message = serialization.serialize({ key });
        local.comm.send(message, remote, callback); // message, remote, callback
    },
    put: (key, value, callback) => {
        const kid = getKID(key);
        const nodeId = context.hash(kid, nidList);
        const remote = {
            node: nodes[nodeId],
            service: 'mem',
            method: 'put'
        };
        const message = serialization.serialize({ key, value });
        local.comm.send(message, remote, callback);
    },
    del: (key, callback) => {
        const kid = getKID(key);
        const nodeId = context.hash(kid, nidList);
        const remote = {
            node: nodes[nodeId],
            service: 'mem',
            method: 'del'
        };
        const message = serialization.serialize({ key });
        local.comm.send(message, remote, callback);
    },
    reconf: () => {
    }
  };
};


module.exports = mem;