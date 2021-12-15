import Mongoose from "mongoose";
const { Schema } = Mongoose

const categorySchema = new Schema({
    name: { type: String, require: true },
    slug: { type: String, require: true },
    date: { type: Date, default: Date.now }
})

const Category = Mongoose.model('Category', categorySchema)
export default Category