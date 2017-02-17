What is Web3.js?

0. **Pre-requisites**
    * Ensure NodeJs is installed
    * Ensure npm is installed

1. **Initialize Node Application**
    * Navigate to the folder 03.UsingWeb3JS
    * Ensure packages are up to date

            npm install

2. **Deploy the Conference contract**
            
            node deployContract.js

3. **Reserve a conference ticket**
Replace 0x0 with the contract address displayed after completing the step above.

            node bookTicket.js 0x0
4. **View contract events**