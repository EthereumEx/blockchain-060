# Connection to Azure blockchain network

## Connecting Geth
1. **Initialize the genesis block**

	Navigate to the folder containing this `data` folder and run the following command.

	`geth --datadir . init ../genesis.json`
	
2. **Copy the list of enodes**

    `<ip address>:3001/staticenodes`
    
2. **Place them in data directory**

    create a file called `static-nodes.json`   

4. **Start GoEthereum**

    `geth --datadir . --networkid 54321`