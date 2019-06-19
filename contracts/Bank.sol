
pragma solidity ^0.5.0;

contract Bank
{
    address manager;
    
    struct customer
    {
        string name;
        uint age;
        uint256 blocknumber;
        string region;
        string typeofAccount;
    }
    
    customer[]  public customerlist;
    uint  public custCount;
    
    mapping(address=>uint)   public balances;
    event transfer(address to,uint amount);
    event bal(uint amount);
    
    constructor()public
    {
        manager=msg.sender;
        custCount=0;
    }
    
    modifier onlyManager()
    {
        require(msg.sender==manager,"you are not the manager");
        _;
        
    }
    /* In order to open the account you have to send minimum 1 ether when you call the function**/
    function openAccount(string memory _name,uint  _age,string memory _region,string memory _typeofAccount)public  payable
    {
        
        require(msg.value >100000000,"insufficient amount");
        customerlist.push(customer(_name,_age,block.number,_region,_typeofAccount));
        custCount++;
        balances[msg.sender]=msg.value;
        emit bal(msg.value);
    }
    /*In order to withdraw amount from your account you need to have suffiecient balance which is stored in the balances mapping the amount has to be specified in wei **/
    function withdraw(uint amount)public{
        require(amount<=balances[msg.sender],"insufficient balance");
        balances[msg.sender]=balances[msg.sender]-amount;
        msg.sender.transfer(amount);
        
    }
    /* You can add money to your account by calling the deposit function and its payable **/
    function deposit()public payable{
        balances[msg.sender]=balances[msg.sender]+msg.value;
    }
    /*You can transfer amount from your account to any ethereum address by specifying the amount **/
    function transferto(uint amount,address payable reciever)public{
         require(amount<=balances[msg.sender],"insufficient balance");
         balances[msg.sender]=balances[msg.sender]-amount;
         reciever.transfer(amount);
         emit transfer(reciever,amount);
    }
    
    /* The person who deployed the contract is the manager and only he can call this function to check the total amount present in the bank **/
   function checkbalanceofbank() public onlyManager view returns(uint){
       return(address(this).balance);
   }
    /* This is a private function which is internally called by the callBalance and returns the Userbalance **/
    
    function Userbalance(address from) private view returns(uint){
        return(balances[from]);
    }
    /*  This is used to the private function Userbalance **/
    function callBalance(address from) public view returns(uint){
        uint balance=Userbalance(from);
        return balance;
    }
}