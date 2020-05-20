pragma solidity ^0.5.0;

contract Escrow {
    address public payer;       //payer's address
    address payable public recipient;       //recipient's address
    address public lawyer;      //lawyer's address. Also deployer of smart contract
    uint256 public amount;      //amount to be reached before release

    //Deploys smart contract and initializes state variables
    constructor(address _payer, address payable _recipient, uint256 _amount) public {
        lawyer = msg.sender;
        payer = _payer;
        recipient = _recipient;
        amount = _amount;
    }
    
    //function to check escrow balance
    function balance() public view returns(uint) {
        
        //returns balance of smart contract address
        return address(this).balance;
    } 
    
    //function for payer to deposit funds
    function deposit() payable public {
        //ensures that only payer can make this call
        require(payer == msg.sender, 'Only payer can make deposits');
        
        //ensures that escrow balance do not exceed specified amount
        require(balance() <= amount, 'Cannot deposit more than specified amount');
    }
    
    //function for lawyer to release funds to the recipient
    function release() external {
        //ensures that only lawyer can make this call
        require(lawyer == msg.sender, 'Only lawyer can release funds');
        
        //lawyer can only send complete amount as specified on deployment
        require(balance() == amount, 'Cannot release incomlete amount');
        
        //transfers amount to recipient's address
        recipient.transfer(amount);
    }
}
