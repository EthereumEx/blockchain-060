'use strict';

var net = require('net');
var debug = require('debug')('oracle-demo');

module.exports = function (web3, config) {
  if(web3.isConnected()) {
    debug('Web3 already connected.');
    return;
  }

  if (config.IpcProvider) {
    debug('Connecting to network using IpcProvider at:', config.IpcProvider);
    var client = new net.Socket();
    web3.setProvider(new web3.providers.IpcProvider(config.IpcProvider, client));
  } else {
    if (!config.rpc.host || !config.rpc.port) {
      throw new Error('Missing RPC host or port. Check config file');
    }

    var rpcEndpoint = config.rpc.host + ':' + config.rpc.port;
    debug('Connecting to network using RPC endpoint at: ', rpcEndpoint);
    web3.setProvider(new web3.providers.HttpProvider(rpcEndpoint));
  }

  if(!web3.isConnected()) {
    debug('Failed to connect to the network.');
    throw new Error('Failed to connect to the network. Make sure the environment variables are set correctly, or you have a RPC server running');
  }
};
