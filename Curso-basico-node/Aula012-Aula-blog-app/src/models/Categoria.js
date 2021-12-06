import mongoose from 'mongoose'
const { Schema } = mongoose

// criando um schema
const CategoriaSchema = ({
    nome: { type: String, require: true },
    slug: { type: String, require: true },
    date: { type: Date, default: Date.now }
})

// criando a model
const Categoria = mongoose.model("Categoria", CategoriaSchema)
export default Categoria