// /*global contract, config, it, assert*/

const Bank = require('Embark/contracts/Bank');

let accounts;

// For documentation please see https://embark.status.im/docs/contracts_testing.html
config({
  //deployment: {
  //  accounts: [
  //    // you can configure custom accounts with a custom balance
  //    // see https://embark.status.im/docs/contracts_testing.html#Configuring-accounts
  //  ]
  //},
  contracts: {
    "Bank": {
      args: {}
    }
  }
}, (_err, web3_accounts) => {
  accounts = web3_accounts
});

contract("Bank", function () {
  this.timeout(0);

  it("Bank was deployed", async function () {
    let address=Bank.options.address
    
    assert.ok(address)
    
  });

  it("Open account", async function () {
    await Bank.methods.openAccount("aaa",25,"bbb","ddd").send({from:accounts[1],value:500000000});
    let result =  await Bank.methods.customerlist(0).call({from:accounts[1]})
    
    assert.equal(result.name,"aaa")
    
  });

  
  it("Should not open account", async function () {
    try{
    await Bank.methods.openAccount("aaa",25,"bbb","ddd").send({from:accounts[2],value:50000})
    }
    catch(error)
    {
      let errormessage=error.message;
      assert.ok(errormessage.includes("insufficient amount"))

      
    }

    
    
  });

  it("Withdrawal", async function() {
    await Bank.methods.openAccount("aaa",25,"bbb","ddd").send({from:accounts[1],value:80000000000});
    let bal= await Bank.methods.callBalance(accounts[1]).call()
    
    await Bank.methods. withdraw(500000).send({from:accounts[1]})
    let balance= await Bank.methods.callBalance(accounts[1]).call()
   
    assert.equal(balance,79999500000)
  });
  it("Withdrawal should not work", async function() {
    try{
    
    await Bank.methods.withdraw(90000000000).send({from:accounts[1]})
    }
    catch(error)
    {
      let errormessage=error.message;
      assert.ok(errormessage.includes("insufficient balance"))

     
    }
    
    
    
  });
  it("The transfer function ",async function(){
     await Bank.methods.openAccount("aaa",25,"bbb","ddd").send({from:accounts[2],value:100000000000});
     await Bank.methods.transferto(50000000,accounts[1]).send({from:accounts[2]})
    let balance= await Bank.methods.callBalance(accounts[1]).call()
    console.log("The deposit balance is",balance)
    assert.equal(balance, 79999500000)



  });

  it("The transfer should fail ",async function(){
    // await Bank.methods.openAccount("aaa",25,"bbb","ddd").send({from:accounts[2],value:100000000000});
    try{
    await Bank.methods.transferto(89999500000,accounts[2]).send({from:accounts[1]})
    }

    catch(error)
    {
      let errormessage=error.message;
      assert.ok(errormessage.includes("insufficient balance"))

    }
  


 });



  it("Deposit", async function() {
    await Bank.methods.openAccount("aaa",25,"bbb","ddd").send({from:accounts[2],value:80000000000});
    let bal= await Bank.methods.callBalance(accounts[2]).call()
    console.log("Before",bal)
    await Bank.methods.deposit().send({from:accounts[2],value:600000000})
    let balance= await Bank.methods.callBalance(accounts[2]).call()
    console.log("The mapping balance is",balance)
     assert.equal(balance, 80600000000)
  });
  it("Bankbalance bymanager only",async function(){
    let balance= await Bank.methods.checkbalanceofbank().call({from:accounts[0],})
    console.log("The mapping balance is",balance)
    assert.equal(balance,261049500000)
  });

  it("Bankbalancebymanager  should fail",async function(){
    try{
    let balance= await Bank.methods.checkbalanceofbank().call({from:accounts[1],})
    }
    catch(error)
    {
      let errormessage=error.message;
      assert.ok(errormessage.includes("you are not the manager"))
    }
  });

  it("User balance",async function(){
    let balance= await Bank.methods.callBalance(accounts[2]).call()
    console.log("The mapping balance is",balance)
    assert.equal(balance,80600000000)
  });

}
)

