import mongoose from 'mongoose'
const { Schema } = mongoose

const CategorySchema = ({
    name: { type: String, require: true },
    slug: { type: String, require: true },
    date: { type: Date, default: Date.now() }
})

const Category = mongoose.model("Category", CategorySchema)
export default Category