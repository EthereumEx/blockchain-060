'use strict';

var Web3 = require('web3');

var config = require('./config/config');
var debug = require('debug')('oracle-demo');
var eventHub = require('./eventhub');
var moment = require('moment');
var _ = require('underscore')

var web3 = new Web3();

require('./config/web3')(web3, config);

var contractABI = require(config.contract.abi);
var Contract = web3.eth.contract(contractABI);
var contract = Contract.at(config.contract.address);


function listenOn(contract) {
  contract.allEvents(function (err, result) {
    if (err) {
      debug('Error listening to contract events: ', err);
      return console.error('Error:', err);
    }

    try {
      var data = _.mapObject(result.args, String);
      debug('Received event', data);
      eventHub.send(data);
    } catch  (err) {
      console.error('Could not parse event', (err));
    }
  });
};


listenOn(contract);





