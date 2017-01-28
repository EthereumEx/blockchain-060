# Setting a private blockchain locally

1. **Execute StartGethMining script**
    * Launch PowerShell
    * Execute the following comand

            ./00.Setup/windows/StartGeth.ps1

# Manual Steps #
1. **[Download GoEthereum]**
    Download and extract the files. Add geth to your local path or use the installer.

2. **Initialize the genesis block**

            geth --datadir .\data init genesis.json

3. **Start GoEthereum with mining enabled**
    By default when geth launches with mining enabled it will attempt to consume all possible resources
    the command below will launch geth only running two threads which should leave CPU cycles to do other 
    activities. The network id is a random number that was selected to ensure this network is isolated.

            geth --datadir .\data --mine --minerthreads 2 --networkid 54321

# FAQ #
* Is there a way to not run mining locally?
* Where can I find more information about genesis.json?
* What is the keystore folder?
* How can I create additional accounts?
    * Navigate to [My Ether Wallet](http://myetherwallet.com)
    * Type in a password that will be used to secure the file generated
    * Download the Keystore file. We'll use this later.
    * Copy the address ex. 0x0000000000000000000000000000000000000000

  


[Download GoEthereum]:https://geth.ethereum.org/downloads/