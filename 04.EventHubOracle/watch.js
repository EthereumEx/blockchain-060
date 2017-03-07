const chalk = require('chalk')
const program = require('commander')
const lib = require('../03.UsingWeb3JS/lib')
// const eventHub = require('./eventhub');

const contractPath = '../Contracts/Conference.sol'
const contractName = 'Conference'

function watch (contract) {
  console.log(chalk.green('Listening for events at:', contract.address))
  contract.allEvents(function (err, result) {
    if (err) {
      return console.error(chalk.red('Error listening to contract events: ', err))
    }

    try {
      console.log('Received event:', JSON.stringify(result.args))
      // eventHub.send(data)
    } catch (err) {
      console.error(chalk.red('Could not parse event', err))
    }
  })
}

function run (address) {
  lib.readContract(contractPath)()
    .then(lib.compileContract(contractName))
    .then(lib.contractAt(address))
    .then(watch)
  .catch(lib.handleError)
}

program
  .arguments('address')
  .description('Watch contract for events')
  .action(run)
  .parse(process.argv)
