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

function FailOnError(e)
{
    if (e)
    {
        console.error(e);
        process.abort();
    }
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
    web3.eth.estimateGas(data, function(e,gas){
        FailOnError(e);
        console.log("Estimated gas " + gas);
        data.gas = gas + 100000;
        web3.eth.sendTransaction(data, fn)
    });
}

function UnlockAccount(account, fn)
{
    console.log("Unlocking account " + account);
    web3.personal.unlockAccount(account, "", fn);
}



function sleep(time, callback) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
    callback();
}

function WaitForBlock(tx)
{
    console.log("Waiting for confirmation");
    var result = web3.eth.getTransaction(tx, function(e,block){
        if (block.blockNumber > 0)
        {
            console.log("Confirmed");
            web3.eth.getTransactionReceipt(tx, function(e, receipt){
                console.log("Block: " + receipt.blockNumber);
                console.log("Tx: " + receipt.transactionHash);
                console.log("Contract Address: " + receipt.contractAddress)
                process.exit(0);
            });
        }
        else
        {
            sleep(3000, function() {
                WaitForBlock(tx);
            });
        }
    }); 
}

function Run()
{
    var account = "0x6eb93fbfdad68416326a5d592b2679da2f1abb17";
    var source = ReadContract();
    CompileContract(source, function(e,r){
        FailOnError(e);
        var contract = r['<stdin>:Conference'];
        UnlockAccount(account, function(e,r) {
            FailOnError(e);
            DeployContract(contract.code, account, function(e,r){
                FailOnError(e);
                WaitForBlock(r);
            })
        })
    });
}

Run();