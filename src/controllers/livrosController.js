import NaoEncontrado from "../erros/NaoEncontrado.js";
import { livros } from "../models/index.js";

class LivroController {

  static listarLivros = async (req, res, next) => {
    try {
      const livrosResultado = await livros.find()
        .populate("autor")
        .exec();

      res.status(200).json(livrosResultado);
    } catch (error) {
      next(error);
    }
  }

  static listarLivroPorId = async (req, res, next) => {
    try {
      const id = req.params.id;
      const livroResultado = await livros.findById(id)
        .populate("autor", "nome")
        .exec();

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
      const busca = processoBusca(req.query);
      const livrosResultado = await livros.find(busca);

      if (livrosResultado !== null) {
        res.status(200).send(livrosResultado);
      } else {
        next(new NaoEncontrado("Editora não encontrada."));
      }
    } catch (error) {
      next(error);
    }
  }



}

function processoBusca(parametros) {

  const { editora, titulo, minPaginas, maxPaginas } = parametros;
  //UTILIZANDO REGEX PARA BUSCA PARCIAL DE DOIS MODOS
  // Cria uma expressão regular para busca case-insensitive do título
  const regex = new RegExp(titulo, 'i');

  const busca = {};
  if (titulo) busca.titulo = regex;
  // Adiciona os filtros à busca se estiverem presentes com valores
  if (editora) busca.editora = { $regex: editora, $options: 'i' };

  if (minPaginas || maxPaginas) busca.numeroPaginas = {};
  // gte: maior ou igual, lte: menor ou igual
  if (minPaginas) busca.numeroPaginas.$gte = minPaginas;
  if (maxPaginas) busca.numeroPaginas.$lte = maxPaginas;
  /*if (minPaginas && maxPaginas) {
    busca.numeroPaginas = { $lte: maxPaginas, $gte: minPaginas };
  }*/

  return busca;
}

export default LivroController