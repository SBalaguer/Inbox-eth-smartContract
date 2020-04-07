const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { interface, bytecode } = require("./compile");
require("dotenv").config();

const provider = new HDWalletProvider(process.env.MNEMONIC, process.env.INFURA_API);

const web3 = new Web3(provider);

const deploy = async () => {
  try {
    const accounts = await web3.eth.getAccounts();

    console.log("Attempting to deply from account", accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface)) //interface is the ABI
      .deploy({ data: "0x" + bytecode, arguments: ["Hello World!"] })
      .send({ gas: 1000000, from: accounts[0] });

    console.log("Contract deployed to:", result.options.address);
  } catch (error) {
    console.log(error.message);
  }
}; //we only create this function to do and async/await

deploy();
