'use strict';
var fs = require('fs');
var net = require('net');
var Web3 = require('web3');

var web3 = new Web3();
var client = net.Socket();
var web3 = new Web3(new Web3.providers.IpcProvider('\\\\.\\pipe\\geth.ipc', client));

function ReadContract()
{
    console.log("Reading contract");
    return fs.readFileSync('../Contracts/Conference.sol', 'utf8');
}

function CompileContract(source, fn)
{
    console.log("Compiling contract");
    web3.eth.compile.solidity(source, fn);
};

function DeployContract(byteCode, account, fn)
{
    console.log("Deploying contract");
    var data = {
        from: account,
        data: byteCode
    }
    web3.eth.sendTransaction(data, fn)
}

function UnlockAccount(account, fn)
{
    console.log("Unlocking account " + account);
    web3.personal.unlockAccount(account, "", fn);
}

function FailOnError(e)
{
    if (e)
    {
        console.error(e);
        process.abort();
    }
}

function sleep(time, callback) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
    callback();
}

function WaitForBlock(tx, fn)
{
    console.log("Waiting for confirmation");
    var result = web3.eth.getTransaction(tx, function(e,block){
        if (block.blockNumber > 0)
        {
            if (!fn)
            {
                console.log("Confirmed");
                process.exit(0);
            }
            else
            {
                fn(e, block);
            }
        }
        else
        {
            sleep(3000, function() {
                WaitForBlock(tx, fn);
            });
        }
    }); 
}

function Run()
{
    var contractAddress = "";
    var account = "0x6eb93fbfdad68416326a5d592b2679da2f1abb17";
    var source = ReadContract();
    CompileContract(source, function(e,r){
        FailOnError(e);
        var contractCompile = r['<stdin>:Conference'];
        var abi = contractCompile.info.abiDefinition;
        var contractAbi = web3.eth.contract(abi);
        var contract = contractAbi.at(contractAddress);

        UnlockAccount(account, function(e,r) {
            FailOnError(e);

            var data = {
                value : 1000,
                from: account,
                gas: 100000
            };

            console.log("Booking Ticket");
            contract.BuyTicket(data, function(e, tx){
                FailOnError(e);
                WaitForBlock(tx, function(e, block){
                    contract.Registrants.call(function(e,r){
                        FailOnError(e);
                        console.log("Tickets reserved: " + r.toNumber());
                        process.exit();
                    });
                });
            });
        });
    });
}

Run();