require('./../config/mongo_database');
let utils = require("./utils")

let Product = require("./../models/product")

async function updateMany(data){
    //data here is one or more products. Do upsert to ensure new products are stored anew
    if(!Array.isArray(data)){
        //handle as single item
        data = [data]
    }
    let affectedIDs = []
    const bulkOp = Product.collection.initializeUnorderedBulkOp()
    data.forEach(element=>{
        //enrich data if needed
        //let enrichElement = element
        let filter = {
            "_id":element._id
        }
        affectedIDs.push(element._id)
        bulkOp.find(filter).upsert().updateOne({$set:element})
    })
    try{
        await bulkOp.execute()
        console.log("Successully updated products")
        return await list({_id:{$in:affectedIDs}})
        
    }catch(e){
        console.log("Error while updating products to DB", e)
        return []
        //TODO. Handle this better. For example: Do we gather list of IDs that failed and go to server to re-request to be sent again?
        //More appropriate could be to retry here again after x seconds
        //Alternativelly, create a new "TASK" that contains information related to "MongoDB retries that contains enough context to fix the problem"
    }
}
async function createProduct(product) {
    //save product into MOGGO and return OK
    //product._id = utils.uuid();
    let productDb = new Product(product);
    await productDb.save();
    console.log('product saved');
    return productDb;
}

async function list(filter) {
    //save product into MOGGO and return OK
    let mainFilter = {active:false, isDeleted:true}
    if(filter){
        mainFilter = filter
    }
   // let items = await Product.find(mainFilter)
    let items = await Product.find()
    return items;
}

module.exports.createProduct = createProduct
module.exports.updateMany = updateMany
module.exports.list = list