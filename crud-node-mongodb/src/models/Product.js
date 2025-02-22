import Mongoose from "mongoose";
const { Schema } = Mongoose

const productSchema = new Schema({
    name: { type: String, require: true },
    quantity: { type: Number, require: true },
    brand: { type: String, require: true },
    description: { type: String, require: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    date: { type: Date, default: Date.now }
})

const Product = Mongoose.model('Product', productSchema)
export default Product