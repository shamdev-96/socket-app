var mongoose   = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema       = mongoose.Schema;

var ModelSchema = new Schema({
  _id:String,
  total:Number,
  items:[],
  transactionNumber: String
}, {strict: false, timestamps:true});

ModelSchema.plugin(mongoosePaginate);
ModelSchema.index({transactionNumber:1}, {unique:true})
module.exports = mongoose.model('Transaction', ModelSchema);