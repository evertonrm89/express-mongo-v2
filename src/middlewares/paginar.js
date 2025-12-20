import RequisicaoIncorreta from "../erros/RequisicaoIncorreta.js";

async function paginar(req, res, next) {

    try {
        let { pagina = 1, limite = 5, ordenacao = "titulo:1" } = req.query;

        let [campo, ordem] = ordenacao.split(":");

        pagina = parseInt(pagina);
        limite = parseInt(limite);
        ordem = parseInt(ordem);

        const resultado = req.resultado;

        if (limite > 0 && pagina > 0) {
            const resultadoPaginado = await resultado.find()
                .sort({ [campo]: ordem })
                .skip((pagina - 1) * limite)
                .limit(limite)
                .exec();

            res.status(200).json(resultadoPaginado);
        } else {
            next(new RequisicaoIncorreta());
        }
    }
    catch (error) {
        next(error);
    }
}

export default paginar;