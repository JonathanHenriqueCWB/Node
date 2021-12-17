import mongoose from 'mongoose'
const { Schema } = mongoose

const PostsSchema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    date: { type: Date, default: Date.now() }
})

const Post = mongoose.model('Post', PostsSchema)
export default Post