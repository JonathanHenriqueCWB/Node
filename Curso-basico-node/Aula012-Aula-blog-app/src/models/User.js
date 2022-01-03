import mongoose  from "mongoose";
const { Schema } = mongoose

const UserSchema = new Schema({
    name: { type: String, require: true },
    lastName: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true }
})

const User = mongoose.model('User', UserSchema)
export default User