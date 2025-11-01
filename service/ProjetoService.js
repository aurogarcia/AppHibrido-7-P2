 const Projeto = require('../models/Projeto');
 const ProjetoService = {
  async listar() {
    return Projeto.find().sort({ createdAt: -1 }).lean();
  },
  async buscarPorId(id) {
    return Projeto.findById(id).lean();
  },
  async criar(dados) {
    return Projeto.create({ nome: dados.nome, descricao: dados.descricao || '' });
  },
  async atualizar(id, dados) {
    return Projeto.findByIdAndUpdate(id, { $set: dados }, { new: true });
  },
  async remover(id) {
    return Projeto.findByIdAndDelete(id);
  },
 };
 module.exports = ProjetoService;