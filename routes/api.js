/**
 * AULA 1 - ROTAS DE API
 * 
 * Este arquivo contém todas as rotas relacionadas à API REST
 * da nossa aplicação. Aqui você pode adicionar novos endpoints.
 */

const express = require('express');
const router = express.Router();

/**
 * STATUS DA API
 * =============
 * Rota: GET /api/status
 * Descrição: Retorna informações sobre o status da API
 */
router.get('/status', (req, res) => {
    console.log('📊 Verificando status da API...');
    
    const status = {
        status: 'online',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version,
        platform: process.platform,
        port: process.env.PORT || 3000
    };
    
    res.json(status);
});

/**
 * STATUS DO BANCO DE DADOS
 * ========================
 * Rota: GET /api/database
 * Descrição: Retorna informações sobre o banco de dados
 */
router.get('/database', async (req, res) => {
    console.log('🗄️ Verificando status do banco de dados...');
    
    try {
        const { getConnectionStatus, testConnection } = require('../config/database');
        const connectionStatus = getConnectionStatus();
        const isConnected = await testConnection();
        
        const databaseStatus = {
            connection: connectionStatus,
            isConnected: isConnected,
            timestamp: new Date().toISOString()
        };
        
        res.json(databaseStatus);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao verificar banco de dados',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * TESTE POST
 * ==========
 * Rota: POST /api/test
 * Descrição: Testa requisições POST
 */
router.post('/test', (req, res) => {
    console.log('🧪 Teste POST recebido...');
    console.log('Dados recebidos:', req.body);
    
    res.json({
        message: 'Teste POST executado com sucesso!',
        receivedData: req.body,
        timestamp: new Date().toISOString()
    });
});

/**
 * LISTAR TAREFAS
 * ==============
 * Rota: GET /api/tarefas
 * Descrição: Retorna lista de tarefas
 */
router.get('/tarefas', (req, res) => {
    console.log('📋 Listando tarefas...');
    
    const tarefas = [
        { id: 1, titulo: 'Configurar ambiente', concluida: true, data: '2024-01-01' },
        { id: 2, titulo: 'Criar rotas', concluida: true, data: '2024-01-02' },
        { id: 3, titulo: 'Implementar funcionalidades', concluida: false, data: '2024-01-03' },
        { id: 4, titulo: 'Testar aplicação', concluida: false, data: '2024-01-04' }
    ];
    
    res.json({
        success: true,
        data: tarefas,
        total: tarefas.length,
        timestamp: new Date().toISOString()
    });
});

/**
 * CRIAR TAREFA
 * ============
 * Rota: POST /api/tarefas
 * Descrição: Cria uma nova tarefa
 */
router.post('/tarefas', (req, res) => {
    console.log('➕ Criando nova tarefa...');
    console.log('Dados recebidos:', req.body);
    
    const { titulo, descricao } = req.body;
    
    if (!titulo) {
        return res.status(400).json({
            success: false,
            error: 'Título é obrigatório',
            timestamp: new Date().toISOString()
        });
    }
    
    const novaTarefa = {
        id: Date.now(),
        titulo,
        descricao: descricao || '',
        concluida: false,
        data: new Date().toISOString().split('T')[0]
    };
    
    res.status(201).json({
        success: true,
        message: 'Tarefa criada com sucesso!',
        data: novaTarefa,
        timestamp: new Date().toISOString()
    });
});

/**
 * ATUALIZAR TAREFA
 * ================
 * Rota: PUT /api/tarefas/:id
 * Descrição: Atualiza uma tarefa existente
 */
router.put('/tarefas/:id', (req, res) => {
    console.log(`🔄 Atualizando tarefa ${req.params.id}...`);
    console.log('Dados recebidos:', req.body);
    
    const { id } = req.params;
    const { titulo, descricao, concluida } = req.body;
    
    res.json({
        success: true,
        message: `Tarefa ${id} atualizada com sucesso!`,
        data: {
            id: parseInt(id),
            titulo,
            descricao,
            concluida,
            dataAtualizacao: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
    });
});

/**
 * DELETAR TAREFA
 * ==============
 * Rota: DELETE /api/tarefas/:id
 * Descrição: Deleta uma tarefa
 */
router.delete('/tarefas/:id', (req, res) => {
    console.log(`🗑️ Deletando tarefa ${req.params.id}...`);
    
    const { id } = req.params;
    
    res.json({
        success: true,
        message: `Tarefa ${id} deletada com sucesso!`,
        timestamp: new Date().toISOString()
    });
});

/**
 * ROTAS DE PROJETOS
 * =================
 */

const ProjetoService = require('../service/ProjetoService');
const { validarProjeto, validarId } = require('../middleware/validation');

/**
 * LISTAR PROJETOS
 * ===============
 * Rota: GET /api/projetos
 * Descrição: Retorna lista de projetos
 */
router.get('/projetos', async (req, res) => {
    console.log('📁 Listando projetos...');
    
    try {
        const itens = await ProjetoService.listar();
        
        res.json({
            success: true,
            data: itens,
            total: itens.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Erro ao listar projetos:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * CRIAR PROJETO
 * =============
 * Rota: POST /api/projetos
 * Descrição: Cria um novo projeto
 */
router.post('/projetos', validarProjeto, async (req, res) => {
    console.log('➕ Criando novo projeto...');
    console.log('Dados recebidos:', req.body);
    
    try {
        const criado = await ProjetoService.criar(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Projeto criado com sucesso!',
            data: criado,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Erro ao criar projeto:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * BUSCAR PROJETO POR ID
 * =====================
 * Rota: GET /api/projetos/:id
 * Descrição: Retorna um projeto específico por ID
 */
router.get('/projetos/:id', validarId, async (req, res) => {
    console.log(`🔍 Buscando projeto ${req.params.id}...`);
    
    try {
        const { id } = req.params;
        const projeto = await ProjetoService.buscarPorId(id);
        
        if (!projeto) {
            return res.status(404).json({
                success: false,
                error: 'Projeto não encontrado',
                timestamp: new Date().toISOString()
            });
        }
        
        res.json({
            success: true,
            data: projeto,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Erro ao buscar projeto:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * ATUALIZAR PROJETO
 * =================
 * Rota: PUT /api/projetos/:id
 * Descrição: Atualiza um projeto existente
 */
router.put('/projetos/:id', validarId, validarProjeto, async (req, res) => {
    console.log(`🔄 Atualizando projeto ${req.params.id}...`);
    console.log('Dados recebidos:', req.body);
    
    try {
        const { id } = req.params;
        const atualizado = await ProjetoService.atualizar(id, req.body);
        
        if (!atualizado) {
            return res.status(404).json({
                success: false,
                error: 'Projeto não encontrado',
                timestamp: new Date().toISOString()
            });
        }
        
        res.json({
            success: true,
            message: `Projeto ${id} atualizado com sucesso!`,
            data: atualizado,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Erro ao atualizar projeto:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * DELETAR PROJETO
 * ===============
 * Rota: DELETE /api/projetos/:id
 * Descrição: Deleta um projeto
 */
router.delete('/projetos/:id', validarId, async (req, res) => {
    console.log(`🗑️ Deletando projeto ${req.params.id}...`);
    
    try {
        const { id } = req.params;
        const removido = await ProjetoService.remover(id);
        
        if (!removido) {
            return res.status(404).json({
                success: false,
                error: 'Projeto não encontrado',
                timestamp: new Date().toISOString()
            });
        }
        
        res.json({
            success: true,
            message: `Projeto ${id} deletado com sucesso!`,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Erro ao deletar projeto:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;


