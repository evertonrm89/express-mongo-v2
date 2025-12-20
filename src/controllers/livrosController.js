import NaoEncontrado from "../erros/NaoEncontrado.js";
import { autores, livros } from "../models/index.js";

class LivroController {

  static listarLivros = async (req, res, next) => {
    try {

      const buscarLivros = livros.find();

      req.resultado = buscarLivros;

      next();

    } catch (error) {
      next(error);
    }
  }

  static listarLivroPorId = async (req, res, next) => {
    try {
      const id = req.params.id;
      const livroResultado = await livros.findById(id);

      if (livroResultado !== null) {
        res.status(200).send(livroResultado);
      } else {
        next(new NaoEncontrado("Id do Livro não encontrado."));
      }

    } catch (error) {
      next(error);
    }
  }

  static cadastrarLivro = async (req, res, next) => {
    try {
      let livro = new livros(req.body);

      const livroResultado = await livro.save();

      res.status(201).send(livroResultado.toJSON());
    } catch (error) {
      next(error);
    }
  }

  static atualizarLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultado = await livros.findByIdAndUpdate(id, { $set: req.body });

      if (livroResultado !== null) {
        res.status(200).send({ message: "Livro atualizado com sucesso" });
      } else {
        next(new NaoEncontrado("Id do Livro não encontrado."));
      }

    } catch (error) {
      next(error);
    }
  }

  static excluirLivro = async (req, res, next) => {
    try {
      const id = req.params.id;
      const livroResultado = await livros.findByIdAndDelete(id);

      if (livroResultado !== null) {
        res.status(200).send({ message: "Livro removido com sucesso" });
      } else {
        next(new NaoEncontrado("Id do Livro não encontrado."));
      }
    } catch (error) {
      next(error);
    }
  }

  static listarLivroPorFiltro = async (req, res, next) => {
    try {
      const busca = await processoBusca(req.query);

      if (busca !== null) {
        const livrosResultado = livros
          .find(busca);

        req.resultado = livrosResultado;
        next();
      } else {
        res.status(200).send([]);
      }
    } catch (error) {
      next(error);
    }
  }



}

async function processoBusca(parametros) {

  const { editora, titulo, minPaginas, maxPaginas, nomeAutor } = parametros;

  //UTILIZANDO REGEX PARA BUSCA PARCIAL DE DOIS MODOS

  // Cria uma expressão regular para busca case-insensitive do título
  const regex = new RegExp(titulo, 'i');

  let busca = {};

  if (titulo) busca.titulo = regex;
  // Adiciona os filtros à busca se estiverem presentes com valores
  if (editora) busca.editora = { $regex: editora, $options: 'i' };

  if (minPaginas || maxPaginas) busca.numeroPaginas = {};
  // gte: maior ou igual, lte: menor ou igual
  if (minPaginas) busca.numeroPaginas.$gte = minPaginas;
  if (maxPaginas) busca.numeroPaginas.$lte = maxPaginas;

  if (nomeAutor) {
    const autor = await autores.findOne({ nome: { $regex: nomeAutor, $options: 'i' } });

    if (autor !== null) {
      busca.autor = autor._id;
    }
    else {
      busca = null;
    }

  }


  return busca;
}

export default LivroController