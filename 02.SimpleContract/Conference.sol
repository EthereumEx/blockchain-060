pragma solidity ^0.4.6;

contract Conference {  // can be killed, so the owner gets sent the money in the end

	address public Organizer;
	mapping (address => uint) public RegistrantsPaid;
	uint public Registrants;
	uint public Quota;

	event Deposit(address from, uint amount); // so you can log the event
	event Refund(address to, uint amount); // so you can log the event

	function Conference() 
    {
		Organizer = msg.sender;		
		Quota = 5;
		Registrants = 0;
	}

	function BuyTicket() payable 
    {
		if (Registrants < Quota) 
        { 
            RegistrantsPaid[msg.sender] = msg.value;
            Registrants++;
            Deposit(msg.sender, msg.value);
        }
	}

	function ChangeQuota(uint newquota) public
    {
		if (msg.sender != Organizer) 
        { 
            throw;
        }

		Quota = newquota;
	}

	function RefundTicket(address recipient, uint amount) public 
    {
		if (msg.sender != Organizer) 
        { 
            throw; 
        }

		if (RegistrantsPaid[recipient] == amount) 
        { 
			address myAddress = this;
			
            if (myAddress.balance >= amount) { 
				if (recipient.send(amount))
				{
				    Refund(recipient, amount);
				    RegistrantsPaid[recipient] = 0;
				    Registrants--;
				}
			}
		}
	}

	function Destroy() 
    {
		if (msg.sender == Organizer) 
        { 
            // without this funds could be locked in the contract forever!
			suicide(Organizer);
		}
	}
}