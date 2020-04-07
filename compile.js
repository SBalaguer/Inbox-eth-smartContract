// we cannot require as usual, because the compiler file has solidity code, not js
// for that, we will use two modules that will help us read the content of the solc compiler info

const path = require("path");
const fs = require("fs");
const solc = require("solc");

const inboxPath = path.resolve(__dirname, "contracts", "Inbox.sol");
const source = fs.readFileSync(inboxPath, "utf8");

//console.log(solc.compile(source,1))from here we got the result and that is why we export.contracts[':Inbox']

module.exports = solc.compile(source, 1).contracts[":Inbox"]; //we pass the source and the number of contracts we want to compile
