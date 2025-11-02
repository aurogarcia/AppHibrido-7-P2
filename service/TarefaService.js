/**
 * SERVIÇO DE TAREFAS
 * ==================
 * 
 * Camada de serviço para operações CRUD de tarefas
 * Conecta com o banco de dados MongoDB
 * 
 * @author Sistema Híbrido
 * @version 2.0.0
 */

const Tarefa = require('../Model/projeto/Tarefa');

/**
 * Serviços de Tarefa
 */
const TarefaService = {
    
    /**
     * Listar todas as tarefas
     */
    async listar(filtros = {}) {
        try {
            console.log('📋 TarefaService: Listando tarefas...');
            
            const query = {};
            
            // Aplicar filtros se fornecidos
            if (filtros.concluida !== undefined) {
                query.concluida = filtros.concluida;
            }
            
            if (filtros.prioridade) {
                query.prioridade = filtros.prioridade;
            }
            
            if (filtros.categoria) {
                query.categoria = filtros.categoria;
            }
            
            if (filtros.responsavel) {
                query.responsavel = new RegExp(filtros.responsavel, 'i');
            }
            
            const tarefas = await Tarefa.find(query)
                .sort({ dataCriacao: -1 }) // Mais recentes primeiro
                .lean(); // Para melhor performance
            
            console.log(`✅ ${tarefas.length} tarefas encontradas`);
            return tarefas;
        } catch (error) {
            console.error('❌ Erro ao listar tarefas:', error);
            throw new Error('Erro ao buscar tarefas no banco de dados');
        }
    },
    
    /**
     * Buscar tarefa por ID
     */
    async buscarPorId(id) {
        try {
            console.log(`🔍 TarefaService: Buscando tarefa ${id}...`);
            
            const tarefa = await Tarefa.findById(id);
            
            if (!tarefa) {
                throw new Error('Tarefa não encontrada');
            }
            
            console.log(`✅ Tarefa encontrada: ${tarefa.titulo}`);
            return tarefa;
        } catch (error) {
            console.error('❌ Erro ao buscar tarefa:', error);
            throw new Error(error.message || 'Erro ao buscar tarefa no banco de dados');
        }
    },
    
    /**
     * Criar nova tarefa
     */
    async criar(dadosTarefa) {
        try {
            console.log('➕ TarefaService: Criando nova tarefa...');
            console.log('📝 Dados recebidos:', dadosTarefa);
            
            // Validar dados obrigatórios
            if (!dadosTarefa.titulo) {
                throw new Error('Título é obrigatório');
            }
            
            const novaTarefa = new Tarefa(dadosTarefa);
            const tarefaSalva = await novaTarefa.save();
            
            console.log(`✅ Tarefa criada com sucesso: ${tarefaSalva.titulo} (ID: ${tarefaSalva._id})`);
            return tarefaSalva;
        } catch (error) {
            console.error('❌ Erro ao criar tarefa:', error);
            
            if (error.name === 'ValidationError') {
                const erros = Object.values(error.errors).map(e => e.message);
                throw new Error(`Erro de validação: ${erros.join(', ')}`);
            }
            
            throw new Error(error.message || 'Erro ao salvar tarefa no banco de dados');
        }
    },
    
    /**
     * Atualizar tarefa existente
     */
    async atualizar(id, dadosAtualizacao) {
        try {
            console.log(`🔄 TarefaService: Atualizando tarefa ${id}...`);
            console.log('📝 Dados de atualização:', dadosAtualizacao);
            
            const tarefaAtualizada = await Tarefa.findByIdAndUpdate(
                id,
                dadosAtualizacao,
                { 
                    new: true, // Retorna o documento atualizado
                    runValidators: true // Executa validações do schema
                }
            );
            
            if (!tarefaAtualizada) {
                throw new Error('Tarefa não encontrada');
            }
            
            console.log(`✅ Tarefa atualizada: ${tarefaAtualizada.titulo}`);
            return tarefaAtualizada;
        } catch (error) {
            console.error('❌ Erro ao atualizar tarefa:', error);
            
            if (error.name === 'ValidationError') {
                const erros = Object.values(error.errors).map(e => e.message);
                throw new Error(`Erro de validação: ${erros.join(', ')}`);
            }
            
            throw new Error(error.message || 'Erro ao atualizar tarefa no banco de dados');
        }
    },
    
    /**
     * Remover tarefa
     */
    async remover(id) {
        try {
            console.log(`🗑️ TarefaService: Removendo tarefa ${id}...`);
            
            const tarefaRemovida = await Tarefa.findByIdAndDelete(id);
            
            if (!tarefaRemovida) {
                throw new Error('Tarefa não encontrada');
            }
            
            console.log(`✅ Tarefa removida: ${tarefaRemovida.titulo}`);
            return tarefaRemovida;
        } catch (error) {
            console.error('❌ Erro ao remover tarefa:', error);
            throw new Error(error.message || 'Erro ao remover tarefa do banco de dados');
        }
    },
    
    /**
     * Marcar tarefa como concluída
     */
    async concluir(id) {
        try {
            console.log(`✅ TarefaService: Concluindo tarefa ${id}...`);
            
            const tarefa = await this.atualizar(id, { 
                concluida: true,
                dataConclusao: new Date()
            });
            
            console.log(`✅ Tarefa concluída: ${tarefa.titulo}`);
            return tarefa;
        } catch (error) {
            console.error('❌ Erro ao concluir tarefa:', error);
            throw error;
        }
    },
    
    /**
     * Marcar tarefa como pendente
     */
    async reabrir(id) {
        try {
            console.log(`🔄 TarefaService: Reabrindo tarefa ${id}...`);
            
            const tarefa = await this.atualizar(id, { 
                concluida: false,
                dataConclusao: null
            });
            
            console.log(`🔄 Tarefa reaberta: ${tarefa.titulo}`);
            return tarefa;
        } catch (error) {
            console.error('❌ Erro ao reabrir tarefa:', error);
            throw error;
        }
    },
    
    /**
     * Obter estatísticas das tarefas
     */
    async obterEstatisticas() {
        try {
            console.log('📊 TarefaService: Calculando estatísticas...');
            
            const estatisticas = await Tarefa.obterEstatisticas();
            
            console.log('📈 Estatísticas calculadas:', estatisticas);
            return estatisticas;
        } catch (error) {
            console.error('❌ Erro ao calcular estatísticas:', error);
            throw new Error('Erro ao calcular estatísticas das tarefas');
        }
    },
    
    /**
     * Buscar tarefas por texto (título ou descrição)
     */
    async buscarPorTexto(texto) {
        try {
            console.log(`🔍 TarefaService: Buscando por texto: "${texto}"`);
            
            const tarefas = await Tarefa.find({
                $or: [
                    { titulo: { $regex: texto, $options: 'i' } },
                    { descricao: { $regex: texto, $options: 'i' } }
                ]
            }).sort({ dataCriacao: -1 });
            
            console.log(`✅ ${tarefas.length} tarefas encontradas para "${texto}"`);
            return tarefas;
        } catch (error) {
            console.error('❌ Erro ao buscar tarefas por texto:', error);
            throw new Error('Erro ao buscar tarefas');
        }
    }
};

module.exports = TarefaService;
