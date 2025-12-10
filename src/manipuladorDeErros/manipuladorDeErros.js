import mongoose from "mongoose";

// eslint-disable-next-line no-unused-vars
function manipuladorDeErros(error, req, res, next) {
  if (error instanceof mongoose.Error.CastError) {
    res.status(400).send({message: "Um ou mais dados fornecidos estão incorretos."});
    } else{
        res.status(500).send({message: "Erro Interno do Servidor."});
    }
}

export default manipuladorDeErros;