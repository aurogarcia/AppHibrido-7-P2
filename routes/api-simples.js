/**
 * ROTAS DE API - VERSÃO SIMPLIFICADA PARA TESTE
 */

console.log('🔄 CARREGANDO ROTAS DA API SIMPLIFICADA...');

const express = require('express');
const router = express.Router();

// Debug: Middleware para logar todas as requisições da API
router.use((req, res, next) => {
    console.log(`🔍 DEBUG: Rota API acessada: ${req.method} ${req.path}`);
    next();
});

/**
 * TESTE SIMPLES
 */
router.get('/test', (req, res) => {
    console.log('🧪 Rota de teste acessada!');
    res.json({ message: 'API funcionando!', timestamp: new Date().toISOString() });
});

/**
 * TESTE POST SIMPLES
 */
router.post('/test-post', (req, res) => {
    console.log('🧪 Teste POST acessado!');
    console.log('Body recebido:', req.body);
    res.json({ 
        message: 'POST funcionando!', 
        received: req.body,
        timestamp: new Date().toISOString() 
    });
});

/**
 * STATUS DA API
 */
router.get('/status', (req, res) => {
    console.log('📊 Verificando status da API...');
    
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
        status: '✅ API Online e Funcionando',
        servidor: 'Aplicativo Híbrido - Projetos e Tarefas',
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
        versao: '1.0.0',
        endpoints_disponiveis: [
            'GET /api/status - Status da API',
            'GET /api/projetos - Listar projetos',
            'POST /api/projetos - Criar projeto',
            'PUT /api/projetos/:id - Atualizar projeto',
            'DELETE /api/projetos/:id - Excluir projeto'
        ]
    };
    
    res.json(status);
});

/**
 * STATUS DO BANCO DE DADOS
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
 * LISTAR TAREFAS (dados mockados melhorados)
 */
router.get('/tarefas', (req, res) => {
    console.log('📋 Listando tarefas...');
    
    const tarefas = [
        { 
            id: 1, 
            titulo: 'Configurar ambiente de desenvolvimento', 
            descricao: 'Instalar Node.js, npm e configurar o projeto inicial',
            concluida: true, 
            prioridade: 'alta',
            categoria: 'setup',
            dataCriacao: '2024-01-01',
            dataConclusao: '2024-01-01',
            tempoEstimado: '2h',
            responsavel: 'Desenvolvedor Principal'
        },
        { 
            id: 2, 
            titulo: 'Criar sistema de rotas', 
            descricao: 'Implementar rotas do Express.js para páginas e API',
            concluida: true, 
            prioridade: 'alta',
            categoria: 'backend',
            dataCriacao: '2024-01-02',
            dataConclusao: '2024-01-02',
            tempoEstimado: '3h',
            responsavel: 'Desenvolvedor Backend'
        },
        { 
            id: 3, 
            titulo: 'Implementar funcionalidades CRUD', 
            descricao: 'Desenvolver operações de Create, Read, Update e Delete para projetos',
            concluida: false, 
            prioridade: 'alta',
            categoria: 'backend',
            dataCriacao: '2024-01-03',
            dataConclusao: null,
            tempoEstimado: '5h',
            responsavel: 'Desenvolvedor Full-Stack'
        },
        { 
            id: 4, 
            titulo: 'Testar aplicação completa', 
            descricao: 'Realizar testes integrados da aplicação e corrigir bugs',
            concluida: false, 
            prioridade: 'media',
            categoria: 'teste',
            dataCriacao: '2024-01-04',
            dataConclusao: null,
            tempoEstimado: '4h',
            responsavel: 'QA Tester'
        },
        { 
            id: 5, 
            titulo: 'Documentar API endpoints', 
            descricao: 'Criar documentação completa da API REST',
            concluida: false, 
            prioridade: 'baixa',
            categoria: 'documentacao',
            dataCriacao: '2024-01-05',
            dataConclusao: null,
            tempoEstimado: '2h',
            responsavel: 'Tech Writer'
        }
    ];
    
    // Calcular estatísticas
    const concluidas = tarefas.filter(t => t.concluida).length;
    const pendentes = tarefas.length - concluidas;
    const porcentagemConclusao = Math.round((concluidas / tarefas.length) * 100);
    
    // Separar por prioridade
    const porPrioridade = {
        alta: tarefas.filter(t => t.prioridade === 'alta').length,
        media: tarefas.filter(t => t.prioridade === 'media').length,
        baixa: tarefas.filter(t => t.prioridade === 'baixa').length
    };
    
    // Separar por categoria
    const porCategoria = tarefas.reduce((acc, tarefa) => {
        acc[tarefa.categoria] = (acc[tarefa.categoria] || 0) + 1;
        return acc;
    }, {});
    
    res.json({
        status: '✅ Tarefas carregadas com sucesso',
        success: true,
        data: tarefas,
        resumo: {
            total: tarefas.length,
            concluidas: concluidas,
            pendentes: pendentes,
            porcentagemConclusao: porcentagemConclusao
        },
        estatisticas: {
            porPrioridade: porPrioridade,
            porCategoria: porCategoria
        },
        informacoes: {
            servidor: 'API de Gerenciamento de Tarefas',
            versao: '2.0.0',
            ultimaAtualizacao: new Date().toLocaleString('pt-BR', {
                timeZone: 'America/Sao_Paulo',
                day: '2-digit',
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        },
        timestamp: new Date().toISOString()
    });
});

/**
 * PROJETOS SIMPLES (dados mockados temporários)
 */

// Array para armazenar projetos em memória (temporário)
let projetosMockados = [
    { id: 1, nome: 'Projeto Teste 1', descricao: 'Primeiro projeto de teste', status: 'ativo' },
    { id: 2, nome: 'Projeto Teste 2', descricao: 'Segundo projeto de teste', status: 'ativo' }
];

// GET - Listar projetos
router.get('/projetos', (req, res) => {
    console.log('📁 Listando projetos (dados mockados)...');
    
    res.json({
        success: true,
        data: projetosMockados,
        total: projetosMockados.length,
        timestamp: new Date().toISOString()
    });
});

// POST - Criar projeto
router.post('/projetos', (req, res) => {
    console.log('➕ Criando projeto (mockado)...');
    console.log('Dados recebidos:', req.body);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Method:', req.method);
    
    try {
        const { nome, descricao } = req.body;
        console.log('Nome extraído:', nome);
        console.log('Descrição extraída:', descricao);
        
        if (!nome || nome.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Nome do projeto é obrigatório',
                timestamp: new Date().toISOString()
            });
        }
        
        // Criar novo projeto mockado
        const novoProjeto = {
            id: Date.now(), // ID único baseado no timestamp
            nome: nome.trim(),
            descricao: descricao ? descricao.trim() : '',
            status: 'ativo',
            criadoEm: new Date().toISOString()
        };
        
        // Adicionar ao array mockado
        projetosMockados.push(novoProjeto);
        
        res.status(201).json({
            success: true,
            message: 'Projeto criado com sucesso!',
            data: novoProjeto,
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

// GET - Buscar projeto por ID
router.get('/projetos/:id', (req, res) => {
    console.log(`🔍 Buscando projeto ${req.params.id} (mockado)...`);
    
    const { id } = req.params;
    const projeto = projetosMockados.find(p => p.id == id);
    
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
});

// PUT - Atualizar projeto
router.put('/projetos/:id', (req, res) => {
    console.log(`🔄 Atualizando projeto ${req.params.id} (mockado)...`);
    console.log('Dados recebidos:', req.body);
    
    try {
        const { id } = req.params;
        const { nome, descricao } = req.body;
        
        const index = projetosMockados.findIndex(p => p.id == id);
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                error: 'Projeto não encontrado',
                timestamp: new Date().toISOString()
            });
        }
        
        // Atualizar projeto
        if (nome) projetosMockados[index].nome = nome.trim();
        if (descricao !== undefined) projetosMockados[index].descricao = descricao.trim();
        projetosMockados[index].atualizadoEm = new Date().toISOString();
        
        res.json({
            success: true,
            message: `Projeto ${id} atualizado com sucesso!`,
            data: projetosMockados[index],
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

// DELETE - Deletar projeto
router.delete('/projetos/:id', (req, res) => {
    console.log(`🗑️ Deletando projeto ${req.params.id} (mockado)...`);
    
    try {
        const { id } = req.params;
        const index = projetosMockados.findIndex(p => p.id == id);
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                error: 'Projeto não encontrado',
                timestamp: new Date().toISOString()
            });
        }
        
        // Remover projeto do array
        const projetoRemovido = projetosMockados.splice(index, 1)[0];
        
        res.json({
            success: true,
            message: `Projeto ${id} deletado com sucesso!`,
            data: projetoRemovido,
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