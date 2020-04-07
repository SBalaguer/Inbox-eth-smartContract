const assert = require("assert"); //used for making assertion about test; to see if some value equals another value
const ganache = require("ganache-cli"); //local eth network
const Web3 = require("web3"); //we are importing a constructor function
//provider: communication layer between web3 and a ganache network
//we will use it a the way of getting and sending requests.

const OPTIONS = {
  defaultBlock: "latest",
  transactionConfirmationBlocks: 1,
  transactionBlockTimeout: 5,
};
const provider = ganache.provider();
const web3 = new Web3(provider, null, OPTIONS); //ganache provider only for testing! In the future, we will be changing that provider to the one that we need in the ETH Network

const { interface, bytecode } = require("../compile");

/*
class Car {
  park() {
    return "stopped";
  }
  drive() {
    return "vroom";
  }
}

describe("Car", () => {
  let car;
  beforeEach(() => {
    car = new Car();
  });
  it("can park", () => {
    assert.equal(car.park(), "stopped");
  });
  it("can run", () => {
    assert.equal(car.drive(), "vroom");
  });
});
*/

//EVERY FUNCTION IN WEB3 IS ASYNC AND RESOLVES IN A PROMIS

let accounts;
let inbox;
const INITIAL_STRING = "Hello World!";

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  //Use one of those accounts to deploy the contract
  //we need to acces the bytecode

  inbox = await new web3.eth.Contract(JSON.parse(interface)) //in here we pase the interface crreated in compile
    .deploy({
      data: bytecode,
      arguments: [INITIAL_STRING],
    }) //in deploy we pass as data the bytecode, and as arguments all the starting values of our contract
    .send({ from: accounts[0], gas: "1000000" }); //in send we select an account to post this(we are selecting the first one that we get), and how much gas to spend.
});

describe("Inbox", () => {
  it("deploys a contract", () => {
    //we are checking to see if we have a contract
    //console.log(inbox);
    assert.ok(inbox.options.address); //checks for a defined value
  });
  it("has a default message", async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, INITIAL_STRING);
  });
  it("manages to change the message", async () => {
    const NEW_MESSAGE = "foo-bar";
    await inbox.methods.setMessage(NEW_MESSAGE).send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, NEW_MESSAGE);
  });
});
