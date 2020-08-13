var mongoose     = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema       = mongoose.Schema;

var ProductSchema = new Schema({
  sku: String,
  _id:String,
  barcode:String,
  name:String,
  category:String,
  supplier:String,
  subCategory:String,
  active:{type:Boolean, default:true}
}, {strict: false, timestamps:true});

ProductSchema.plugin(mongoosePaginate);
ProductSchema.index({sku:1}, {unique:true})
ProductSchema.index({active:1, deleted:1 , name:1 , barcode:1}, {})
module.exports = mongoose.model('Product', ProductSchema);//