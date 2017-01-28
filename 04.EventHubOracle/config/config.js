'use strict';

var path      = require('path'),
    rootPath  = path.normalize(__dirname + '/..'),
    env       = process.env.NODE_ENV || 'development';

var contractAbi = path.join(rootPath, '../Contracts/Conference.abi.json');

var config = {
  development: {
    env: 'development',
    root: rootPath,
    IpcProvider: process.env.IPC_PROVIDER,
    rpc: {
      host: process.env.RPC_HOST || 'http://localhost',
      port: process.env.RPC_PORT || '8545'
    },
    contract: {
      address: process.env.CONTRACT_ADDRESS,
      abi: process.env.CONTRACT_ABI_PATH || contractAbi
    },
    eventhub : {
      connectionString: process.env.EVENT_HUB_CONNECTION_STRING,
      path: process.env.EVENTHUB_PATH || 'dev'
    }
  },

  test: {
    env: 'test',
    root: rootPath,
    IpcProvider: process.env.IPC_PROVIDER,
    rpc: {
      host: process.env.RPC_HOST || 'http://localhost',
      port: process.env.RPC_PORT || '8545'
    },
    contract: {
      address: process.env.CONTRACT_ADDRESS,
      abi: process.env.CONTRACT_ABI_PATH || contractAbi
    },
    eventhub : {
      connectionString: process.env.EVENT_HUB_CONNECTION_STRING,
      path: process.env.EVENTHUB_PATH || 'test'
    }
  },

  production: {
    env: 'production',
    root: rootPath,
    IpcProvider: process.env.IPC_PROVIDER,
    rpc: {
      host: process.env.RPC_HOST || 'http://localhost',
      port: process.env.RPC_PORT || '8545'
    },
    contract: {
      address: process.env.CONTRACT_ADDRESS,
      abi: process.env.CONTRACT_ABI_PATH || contractAbi
    },
    eventhub : {
      connectionString: process.env.EVENT_HUB_CONNECTION_STRING,
      path: process.env.EVENTHUB_PATH
    }
  }
};

module.exports = config[env];
