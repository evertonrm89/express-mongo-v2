import mongoose from "mongoose";

// eslint-disable-next-line no-unused-vars
function manipuladorDeErros(error, req, res, next) {

  console.log(error);

  if (error instanceof mongoose.Error.CastError) {
    res.status(400).send({message: "Um ou mais dados fornecidos estão incorretos."});
    }else if(error instanceof mongoose.Error.ValidationError){

      const mensagemErro = Object.values(error.Error)
        .map(error => error.message)
        .join("; ");

      res.status(400).send({message: "Houve um erro de validação de dados"});
    } 
    
    else{
        res.status(500).send({message: "Erro Interno do Servidor."});
    }
}

export default manipuladorDeErros;