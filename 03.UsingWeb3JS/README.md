What is Web3.js?

0. **Pre-requisites**

	Install [NodeJS and npm](https://nodejs.org/en/) if not already installed.

1. **Initialize Node Application**
    * Navigate to the folder 03.UsingWeb3JS
    * Ensure packages are up to date
    * Run `npm install`

2. **Deploy the Conference contract**
            
	`node deployConference.js 0x6CA393AD5E8c30E14f40c91AF76Bf7D79EBcbcE2`

3. **Reserve a conference ticket**
	
	`node buyTicket.js --buyer 0x9dA7335F89dDF43516010Efd6Dd8Ca5CBd0121d2 --contract <address>`
4. **View contract events**
