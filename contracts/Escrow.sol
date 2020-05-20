pragma solidity ^0.5.0;

contract Escrow {
    address public payer;
    address payable public recipient;
    address public lawyer;
    uint256 public amount;

    constructor(address _payer, address payable _recipient, uint256 _amount) public {
        lawyer = msg.sender;
        payer = _payer;
        recipient = _recipient;
        amount = _amount;
    }
    
    function balance() public view returns(uint) {
        return address(this).balance;
    } 
    
    function deposit() payable public {
        require(payer == msg.sender, 'Only payer can make deposits');
        require(balance() <= amount, 'Cannot deposit more than specified amount');
    }
    
    function release() external {
        require(lawyer == msg.sender, 'Only lawyer can release funds');
        require(balance() == amount, 'Cannot release incomlete amount');
        recipient.transfer(amount);
    }
}
