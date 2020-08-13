//require('./config/mongo_database');
let utils = require("./utils")
let Transaction = require("../models/transaction")

async function createTransaction(payload) {
    //save product into MOGGO and return OK

    //TODO: try catch (return failure error , if success, return payload)
    payload._id = utils.uuid();
    let transaction = new Transaction(payload);
    await transaction.save();
    console.log('transaction saved');

    return transaction;
}

module.exports.createTransaction = createTransaction
