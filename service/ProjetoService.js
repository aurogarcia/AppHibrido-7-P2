const Projeto = require('../Model/projeto/Projeto');
const Tarefa = require('../Model/projeto/Tarefa');

const ProjetoService = {
    async listar() {
        return Projeto.find().sort({ createdAt: -1 }).lean();
    },
    
    async buscarPorId(id) {
        return Projeto.findById(id).lean();
    },
    
    async criar(dados) {
        const novosDados = {
            nome: dados.nome,
            descricao: dados.descricao || '',
            prioridade: dados.prioridade || 'media',
            status: dados.status || 'ativo'
        };
        
        // Adicionar campos extras se fornecidos
        if (dados.dataEntrega) novosDados.dataFim = new Date(dados.dataEntrega);
        if (dados.responsavel) novosDados.responsavel = dados.responsavel;
        
        return Projeto.create(novosDados);
    },
    
    async atualizar(id, dados) {
        return Projeto.findByIdAndUpdate(id, { $set: dados }, { new: true });
    },
    
    async remover(id) {
        // Primeiro, vamos verificar se o projeto existe
        const projeto = await Projeto.findById(id);
        if (!projeto) {
            throw new Error('Projeto não encontrado');
        }
        
        // Importar o modelo de Tarefa
        const Tarefa = require('../Model/projeto/Tarefa');
        
        // Remover todas as tarefas associadas ao projeto
        const tarefasRemovidas = await Tarefa.deleteMany({ projeto: id });
        console.log(`🗑️ ${tarefasRemovidas.deletedCount} tarefas associadas foram removidas`);
        
        // Remover o projeto
        const projetoRemovido = await Projeto.findByIdAndDelete(id);
        
        return {
            ...projetoRemovido.toObject(),
            tarefasRemovidas: tarefasRemovidas.deletedCount
        };
    },
    
    async obterEstatisticas() {
        const total = await Projeto.countDocuments();
        const ativos = await Projeto.countDocuments({ status: 'ativo' });
        const concluidos = await Projeto.countDocuments({ status: 'concluido' });
        
        return { total, ativos, concluidos };
    }
};
 module.exports = ProjetoService;