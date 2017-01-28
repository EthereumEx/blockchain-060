var EventHubClient = require('azure-event-hubs').Client;
var Promise = require('bluebird');
var debug = require('debug')('eventhub-oracle');
var config = require('./config/config');

var client = EventHubClient.fromConnectionString(config.eventhub.connectionString, config.eventhub.path);

exports.send = function(content) {
    client.createSender(0)
      .then(function(tx){
        debug("Sending Event");
        debug(content);
        tx.on('errorReceived', function(err) { console.error(err);});
        tx.send(content, '1');
      })
};
