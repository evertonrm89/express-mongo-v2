import mongoose from "mongoose";

const livroSchema = new mongoose.Schema(
  {
    id: { type: String },
    titulo: {
      type: String,
      required: [true, "O título do livro é obrigatório"]
    },
    editora: {
      type: String,
      required: [true, "A editora do livro é obrigatória"],
      enum: {
        values: ["Casa do Código", "Novatec", "Alura", "Outros"],
        message: "A editora {VALUE} não é um valor permitido "

      }
    },
    numeroPaginas: {
      type: Number,
      min: [10, "O número de páginas deve estar entre 10 e 5000. Valor fornecido: {VALUE}"],
      max: [5000, "O número de páginas deve estar entre 10 e 5000. Valor fornecido: {VALUE}"]
    },
    preco: {
      type: Number,
      validate: {
        validator: (valor) => {
          return valor >= 1;
        },
        message: "O preço do livro deve ser maior ou igual a R$ 1,00. Valor fornecido: {VALUE}"
      }
    },
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'autores',
      required: [true, "O autor do livro é obrigatório."]
    }
  }
);

const livros = mongoose.model('livros', livroSchema);

export default livros;