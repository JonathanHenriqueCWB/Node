import mongoogse from 'mongoose'
const { Schema } = mongoogse

const UsuarioSchema = new Schema({
    nome: { type: String, required: true},
    email: { type: String, required: true},
    senha: { type: String, required: true}
})

const Usuario = mongoogse.model('Usuario', UsuarioSchema)
export default Usuario