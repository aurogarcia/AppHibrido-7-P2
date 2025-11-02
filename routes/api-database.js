/**
 * ROTAS DA API COM BANCO DE DADOS
 * ===============================
 * 
 * Rotas da API REST que conectam com MongoDB
 * Versão completa com CRUD de Tarefas e Projetos
 * 
 * @author Sistema Híbrido
 * @version 2.0.0
 */

const express = require('express');
const router = express.Router();

// Importar serviços
const TarefaService = require('../service/TarefaService');
const ProjetoService = require('../service/ProjetoService');

console.log('🔄 CARREGANDO ROTAS DA API COM BANCO DE DADOS...');

/**
 * ============================================================================
 * 📊 STATUS DA API
 * ============================================================================
 */

/**
 * POPULAR BANCO DE DADOS COM EXEMPLOS
 */
router.post('/popular-banco', async (req, res) => {
    try {
        console.log('🌱 Populando banco de dados com tarefas de exemplo...');
        
        // Tarefas de exemplo
        const tarefasExemplo = [
            {
                titulo: 'Configurar ambiente de desenvolvimento',
                descricao: 'Instalar Node.js, npm, MongoDB e configurar o projeto inicial',
                concluida: true,
                prioridade: 'alta',
                categoria: 'setup',
                responsavel: 'Desenvolvedor Principal',
                tempoEstimado: '2h',
                tags: ['configuração', 'setup', 'nodejs']
            },
            {
                titulo: 'Criar sistema de rotas Express.js',
                descricao: 'Implementar rotas para páginas web e API REST',
                concluida: true,
                prioridade: 'alta',
                categoria: 'backend',
                responsavel: 'Desenvolvedor Backend',
                tempoEstimado: '3h',
                tags: ['express', 'rotas', 'api']
            },
            {
                titulo: 'Implementar operações CRUD para tarefas',
                descricao: 'Desenvolver Create, Read, Update e Delete para tarefas',
                concluida: false,
                prioridade: 'alta',
                categoria: 'backend',
                responsavel: 'Desenvolvedor Full-Stack',
                tempoEstimado: '4h',
                tags: ['crud', 'mongodb', 'mongoose']
            },
            {
                titulo: 'Criar interface web responsiva',
                descricao: 'Desenvolver interface moderna usando EJS templates',
                concluida: false,
                prioridade: 'alta',
                categoria: 'frontend',
                responsavel: 'Desenvolvedor Frontend',
                tempoEstimado: '5h',
                tags: ['ejs', 'css', 'javascript']
            },
            {
                titulo: 'Escrever testes automatizados',
                descricao: 'Criar testes unitários e de integração',
                concluida: false,
                prioridade: 'media',
                categoria: 'teste',
                responsavel: 'QA Engineer',
                tempoEstimado: '4h',
                tags: ['jest', 'testes', 'qualidade']
            },
            {
                titulo: 'Documentar API endpoints',
                descricao: 'Criar documentação completa da API REST',
                concluida: false,
                prioridade: 'baixa',
                categoria: 'documentacao',
                responsavel: 'Tech Writer',
                tempoEstimado: '2h',
                tags: ['swagger', 'documentação', 'api']
            }
        ];
        
        // Verificar se já existem tarefas
        const tarefasExistentes = await TarefaService.obterEstatisticas();
        
        if (tarefasExistentes.total > 0) {
            return res.json({
                status: '⚠️ Banco já possui tarefas',
                success: false,
                message: `Já existem ${tarefasExistentes.total} tarefas no banco. Use a rota DELETE /api/limpar-banco primeiro se desejar recomeçar.`,
                estatisticas_atuais: tarefasExistentes,
                timestamp: new Date().toISOString()
            });
        }
        
        // Inserir tarefas de exemplo
        const tarefasInseridas = [];
        for (const dadosTarefa of tarefasExemplo) {
            const tarefa = await TarefaService.criar(dadosTarefa);
            tarefasInseridas.push(tarefa);
        }
        
        // Obter estatísticas atualizadas
        const novasEstatisticas = await TarefaService.obterEstatisticas();
        
        res.status(201).json({
            status: '🌱 Banco populado com sucesso',
            success: true,
            message: `${tarefasInseridas.length} tarefas de exemplo foram inseridas no banco de dados`,
            tarefas_inseridas: tarefasInseridas.length,
            estatisticas: novasEstatisticas,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Erro ao popular banco:', error);
        
        res.status(500).json({
            status: '❌ Erro ao popular banco',
            success: false,
            erro: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * LIMPAR BANCO DE DADOS (cuidado!)
 */
router.delete('/limpar-banco', async (req, res) => {
    try {
        console.log('🗑️ Limpando banco de dados...');
        
        const estatisticasAntes = await TarefaService.obterEstatisticas();
        
        // Remover todas as tarefas
        const resultado = await require('../Model/projeto/Tarefa').deleteMany({});
        
        res.json({
            status: '🗑️ Banco limpo com sucesso',
            success: true,
            message: `${resultado.deletedCount} tarefas foram removidas do banco de dados`,
            tarefas_removidas: resultado.deletedCount,
            estatisticas_anteriores: estatisticasAntes,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Erro ao limpar banco:', error);
        
        res.status(500).json({
            status: '❌ Erro ao limpar banco',
            success: false,
            erro: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

router.get('/status', async (req, res) => {
    console.log('📊 Verificando status da API...');
    
    try {
        // Obter estatísticas do banco
        const estatisticasTarefas = await TarefaService.obterEstatisticas();
        
        // Calcular tempo online de forma mais legível
        const uptimeSeconds = Math.floor(process.uptime());
        const hours = Math.floor(uptimeSeconds / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = uptimeSeconds % 60;
        
        let tempoOnline = '';
        if (hours > 0) tempoOnline += `${hours}h `;
        if (minutes > 0) tempoOnline += `${minutes}m `;
        tempoOnline += `${seconds}s`;
        
        const status = {
            status: '✅ API Online e Conectada ao Banco',
            servidor: 'Sistema Híbrido - Gerenciamento Completo',
            tempo_online: tempoOnline,
            porta: process.env.PORT || 3000,
            data_hora: new Date().toLocaleString('pt-BR', {
                timeZone: 'America/Sao_Paulo',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }),
            versao: '2.0.0',
            banco_dados: {
                conectado: true,
                tipo: 'MongoDB Atlas',
                tarefas_cadastradas: estatisticasTarefas.total
            },
            endpoints_disponiveis: [
                'GET /api/status - Status da API',
                'POST /api/popular-banco - Popular com dados de exemplo',
                'DELETE /api/limpar-banco - Limpar todas as tarefas',
                'GET /api/tarefas - Listar tarefas',
                'POST /api/tarefas - Criar tarefa',
                'PUT /api/tarefas/:id - Atualizar tarefa',
                'DELETE /api/tarefas/:id - Excluir tarefa',
                'POST /api/tarefas/:id/concluir - Concluir tarefa',
                'POST /api/tarefas/:id/reabrir - Reabrir tarefa',
                'GET /api/projetos - Listar projetos',
                'POST /api/projetos - Criar projeto'
            ]
        };
        
        res.json(status);
    } catch (error) {
        console.error('❌ Erro ao verificar status:', error);
        
        // Status quando há problemas com banco
        const status = {
            status: '⚠️ API Online (Problemas no Banco)',
            servidor: 'Sistema Híbrido - Modo Degradado',
            erro: 'Não foi possível conectar com o banco de dados',
            versao: '2.0.0',
            data_hora: new Date().toLocaleString('pt-BR')
        };
        
        res.status(503).json(status);
    }
});

/**
 * ============================================================================
 * 📋 ROTAS DE TAREFAS
 * ============================================================================
 */

/**
 * LISTAR TAREFAS
 */
router.get('/tarefas', async (req, res) => {
    try {
        console.log('📋 Listando tarefas do banco de dados...');
        
        // Obter filtros da query string
        const filtros = {
            concluida: req.query.concluida ? req.query.concluida === 'true' : undefined,
            prioridade: req.query.prioridade,
            categoria: req.query.categoria,
            responsavel: req.query.responsavel
        };
        
        // Buscar tarefas e estatísticas
        const [tarefas, estatisticas] = await Promise.all([
            TarefaService.listar(filtros),
            TarefaService.obterEstatisticas()
        ]);
        
        // Formatar resposta
        res.json({
            status: '✅ Tarefas carregadas do banco de dados',
            success: true,
            data: tarefas,
            resumo: {
                total: estatisticas.total,
                concluidas: estatisticas.concluidas,
                pendentes: estatisticas.pendentes,
                porcentagemConclusao: estatisticas.porcentagemConclusao
            },
            estatisticas: {
                porPrioridade: estatisticas.porPrioridade,
                porCategoria: estatisticas.porCategoria
            },
            filtros_aplicados: filtros,
            informacoes: {
                servidor: 'API de Gerenciamento - MongoDB',
                versao: '2.0.0',
                ultimaAtualizacao: new Date().toLocaleString('pt-BR', {
                    timeZone: 'America/Sao_Paulo'
                })
            },
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Erro ao listar tarefas:', error);
        
        res.status(500).json({
            status: '❌ Erro ao carregar tarefas',
            success: false,
            erro: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * BUSCAR TAREFA POR ID
 */
router.get('/tarefas/:id', async (req, res) => {
    try {
        console.log(`🔍 Buscando tarefa ${req.params.id}...`);
        
        const tarefa = await TarefaService.buscarPorId(req.params.id);
        
        res.json({
            status: '✅ Tarefa encontrada',
            success: true,
            data: tarefa,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Erro ao buscar tarefa:', error);
        
        const statusCode = error.message.includes('não encontrada') ? 404 : 500;
        
        res.status(statusCode).json({
            status: '❌ Tarefa não encontrada',
            success: false,
            erro: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * CRIAR NOVA TAREFA
 */
router.post('/tarefas', async (req, res) => {
    try {
        console.log('➕ Criando nova tarefa...');
        console.log('📝 Dados recebidos:', req.body);
        
        // Log específico para datas
        if (req.body.dataVencimento) {
            console.log('📅 Data de vencimento recebida:', req.body.dataVencimento);
            console.log('📅 Tipo da data:', typeof req.body.dataVencimento);
            console.log('📅 Data parseada:', new Date(req.body.dataVencimento));
        }
        
        const novaTarefa = await TarefaService.criar(req.body);
        
        res.status(201).json({
            status: '✅ Tarefa criada com sucesso',
            success: true,
            data: novaTarefa,
            message: `Tarefa "${novaTarefa.titulo}" foi criada e salva no banco de dados`,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Erro ao criar tarefa:', error);
        
        res.status(400).json({
            status: '❌ Erro ao criar tarefa',
            success: false,
            erro: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * ATUALIZAR TAREFA
 */
router.put('/tarefas/:id', async (req, res) => {
    try {
        console.log(`🔄 Atualizando tarefa ${req.params.id}...`);
        console.log('📝 Dados para atualização:', req.body);
        
        const tarefaAtualizada = await TarefaService.atualizar(req.params.id, req.body);
        
        res.json({
            status: '✅ Tarefa atualizada com sucesso',
            success: true,
            data: tarefaAtualizada,
            message: `Tarefa "${tarefaAtualizada.titulo}" foi atualizada no banco de dados`,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Erro ao atualizar tarefa:', error);
        
        const statusCode = error.message.includes('não encontrada') ? 404 : 400;
        
        res.status(statusCode).json({
            status: '❌ Erro ao atualizar tarefa',
            success: false,
            erro: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * CONCLUIR TAREFA
 */
router.post('/tarefas/:id/concluir', async (req, res) => {
    try {
        console.log(`✅ Concluindo tarefa ${req.params.id}...`);
        
        const tarefaConcluida = await TarefaService.concluir(req.params.id);
        
        res.json({
            status: '✅ Tarefa concluída',
            success: true,
            data: tarefaConcluida,
            message: `Tarefa "${tarefaConcluida.titulo}" foi marcada como concluída`,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Erro ao concluir tarefa:', error);
        
        const statusCode = error.message.includes('não encontrada') ? 404 : 500;
        
        res.status(statusCode).json({
            status: '❌ Erro ao concluir tarefa',
            success: false,
            erro: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * REABRIR TAREFA
 */
router.post('/tarefas/:id/reabrir', async (req, res) => {
    try {
        console.log(`🔄 Reabrindo tarefa ${req.params.id}...`);
        
        const tarefaReaberta = await TarefaService.reabrir(req.params.id);
        
        res.json({
            status: '🔄 Tarefa reaberta',
            success: true,
            data: tarefaReaberta,
            message: `Tarefa "${tarefaReaberta.titulo}" foi marcada como pendente`,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Erro ao reabrir tarefa:', error);
        
        const statusCode = error.message.includes('não encontrada') ? 404 : 500;
        
        res.status(statusCode).json({
            status: '❌ Erro ao reabrir tarefa',
            success: false,
            erro: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * DELETAR TAREFA
 */
router.delete('/tarefas/:id', async (req, res) => {
    try {
        console.log(`🗑️ Deletando tarefa ${req.params.id}...`);
        
        const tarefaRemovida = await TarefaService.remover(req.params.id);
        
        res.json({
            status: '🗑️ Tarefa deletada com sucesso',
            success: true,
            data: tarefaRemovida,
            message: `Tarefa "${tarefaRemovida.titulo}" foi removida do banco de dados`,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Erro ao deletar tarefa:', error);
        
        const statusCode = error.message.includes('não encontrada') ? 404 : 500;
        
        res.status(statusCode).json({
            status: '❌ Erro ao deletar tarefa',
            success: false,
            erro: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * ============================================================================
 * 📁 ROTAS DE PROJETOS - CONECTADAS AO MONGODB
 * ============================================================================
 */

/**
 * LISTAR PROJETOS
 */
router.get('/projetos', async (req, res) => {
    try {
        console.log('📁 Listando projetos do banco de dados...');
        
        const projetos = await ProjetoService.listar();
        
        res.json({
            status: '✅ Projetos carregados do banco de dados',
            success: true,
            data: projetos,
            total: projetos.length,
            informacoes: {
                servidor: 'API de Gerenciamento - MongoDB',
                versao: '2.0.0',
                ultimaAtualizacao: new Date().toLocaleString('pt-BR', {
                    timeZone: 'America/Sao_Paulo'
                })
            },
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Erro ao listar projetos:', error);
        
        res.status(500).json({
            status: '❌ Erro ao listar projetos',
            success: false,
            erro: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * CRIAR PROJETO
 */
router.post('/projetos', async (req, res) => {
    try {
        console.log('➕ Criando novo projeto...');
        console.log('📝 Dados recebidos:', req.body);
        
        const novoProjeto = await ProjetoService.criar(req.body);
        
        res.status(201).json({
            status: '✅ Projeto criado com sucesso',
            success: true,
            data: novoProjeto,
            message: `Projeto "${novoProjeto.nome}" foi criado e salvo no banco de dados`,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Erro ao criar projeto:', error);
        
        res.status(400).json({
            status: '❌ Erro ao criar projeto',
            success: false,
            erro: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * ATUALIZAR PROJETO
 */
router.put('/projetos/:id', async (req, res) => {
    try {
        console.log(`🔄 Atualizando projeto ${req.params.id}...`);
        console.log('📝 Dados para atualização:', req.body);
        
        const projetoAtualizado = await ProjetoService.atualizar(req.params.id, req.body);
        
        res.json({
            status: '✅ Projeto atualizado com sucesso',
            success: true,
            data: projetoAtualizado,
            message: `Projeto "${projetoAtualizado.nome}" foi atualizado no banco de dados`,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Erro ao atualizar projeto:', error);
        
        const statusCode = error.message.includes('não encontrado') ? 404 : 400;
        
        res.status(statusCode).json({
            status: '❌ Erro ao atualizar projeto',
            success: false,
            erro: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * DELETAR PROJETO
 */
router.delete('/projetos/:id', async (req, res) => {
    try {
        console.log(`🗑️ Deletando projeto ${req.params.id}...`);
        
        const projetoDeletado = await ProjetoService.remover(req.params.id);
        
        res.json({
            status: '✅ Projeto deletado com sucesso',
            success: true,
            data: projetoDeletado,
            message: `Projeto "${projetoDeletado.nome}" foi removido do banco de dados`,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Erro ao deletar projeto:', error);
        
        const statusCode = error.message.includes('não encontrado') ? 404 : 500;
        
        res.status(statusCode).json({
            status: '❌ Erro ao deletar projeto',
            success: false,
            erro: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

console.log('✅ Rotas da API com banco de dados carregadas!');

module.exports = router;