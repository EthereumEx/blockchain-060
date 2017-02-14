pragma solidity ^0.4.6;

contract Booking {
  struct BookingState {
    uint price;
    uint bookingState;
    uint sequenceNumber;
    uint lastUpdated;
  }

  uint differenceLimit;  
  string commonReferenceId;
  address seller;
  address buyer;
  BookingState buyerBookingInfo;
  BookingState sellerBookingInfo;
  uint contractState;   //Initialised = 1, Approved = 2, Incomplete = 3, Dispute = 9

  function Booking(address _buyer, string _commonReferenceId) {
    seller = msg.sender;
    buyer = _buyer;
    contractState = 1;
    differenceLimit = 1;
    commonReferenceId = _commonReferenceId;
  }

	function updateBookingInfo(uint price, uint bookingState, uint sequenceNumber)  {
		if (msg.sender != seller && msg.sender != buyer) {
			throw;
		}
		else if(msg.sender == seller && sequenceNumber < sellerBookingInfo.sequenceNumber) {
			throw;
		}
		else if(msg.sender == buyer && sequenceNumber < buyerBookingInfo.sequenceNumber) {
			throw;
		}
		
		if(seller == msg.sender) {
			sellerBookingInfo.price = price;
			sellerBookingInfo.bookingState = bookingState;
			sellerBookingInfo.sequenceNumber = sequenceNumber;
			sellerBookingInfo.lastUpdated = now;
		}
		else if(buyer == msg.sender) {
			buyerBookingInfo.price = price;
			buyerBookingInfo.bookingState = bookingState;
			buyerBookingInfo.sequenceNumber = sequenceNumber;
			buyerBookingInfo.lastUpdated = now;
		}
	}

	function compareBookingInfo() constant returns (uint) {
		if(sellerBookingInfo.lastUpdated == 0 && 
				(buyerBookingInfo.lastUpdated != 0 && buyerBookingInfo.price == 0 && buyerBookingInfo.bookingState == 9)) {
			contractState = 1;
		}
		else if(buyerBookingInfo.lastUpdated == 0 && 
				(sellerBookingInfo.lastUpdated != 0 && sellerBookingInfo.price == 0 && sellerBookingInfo.bookingState == 9)) {
			contractState = 1;
		}
		else if(sellerBookingInfo.lastUpdated == 0 || buyerBookingInfo.lastUpdated == 0) {
			contractState = 3;
		}
		else if(sellerBookingInfo.bookingState == buyerBookingInfo.bookingState && 
				sellerBookingInfo.price == buyerBookingInfo.price) {
			contractState = 2;
		}
		else {
			contractState = 9; 
		}
		return contractState;
	}
}
