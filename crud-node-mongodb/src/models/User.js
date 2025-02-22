import mongoose from 'mongoose'
const {Schema} = mongoose

const userSchema = new Schema({
    name: {type: String},
    email: {type: String},
    password: {type: String},
    isAdmin: {type: Number, default: 0}
})

const User = mongoose.model('User', userSchema)
export default User