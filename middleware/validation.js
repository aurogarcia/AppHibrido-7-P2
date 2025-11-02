/**
 * MIDDLEWARE DE VALIDAÇÃO
 * ======================
 * 
 * Este arquivo contém middlewares reutilizáveis para validação de dados
 * de entrada nas rotas da API, seguindo boas práticas de desenvolvimento.
 */

/**
 * Middleware para validar dados de projeto
 * @param {Object} req - Request object
 * @param {Object} res - Response object  
 * @param {Function} next - Next middleware function
 */
const validarProjeto = (req, res, next) => {
    const { nome, descricao } = req.body;
    
    // Validações obrigatórias
    if (!nome || nome.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Nome do projeto é obrigatório',
            field: 'nome',
            timestamp: new Date().toISOString()
        });
    }
    
    // Validações de formato
    if (nome.length < 3) {
        return res.status(400).json({
            success: false,
            error: 'Nome do projeto deve ter pelo menos 3 caracteres',
            field: 'nome',
            timestamp: new Date().toISOString()
        });
    }
    
    if (nome.length > 100) {
        return res.status(400).json({
            success: false,
            error: 'Nome do projeto não pode exceder 100 caracteres',
            field: 'nome',
            timestamp: new Date().toISOString()
        });
    }
    
    if (descricao && descricao.length > 500) {
        return res.status(400).json({
            success: false,
            error: 'Descrição não pode exceder 500 caracteres',
            field: 'descricao',
            timestamp: new Date().toISOString()
        });
    }
    
    // Sanitização dos dados
    req.body.nome = nome.trim();
    req.body.descricao = descricao ? descricao.trim() : '';
    
    next();
};

/**
 * Middleware para validar dados de tarefa
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const validarTarefa = (req, res, next) => {
    const { titulo, descricao, projetoId } = req.body;
    
    // Validações obrigatórias
    if (!titulo || titulo.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Título da tarefa é obrigatório',
            field: 'titulo',
            timestamp: new Date().toISOString()
        });
    }
    
    // Validações de formato
    if (titulo.length < 3) {
        return res.status(400).json({
            success: false,
            error: 'Título da tarefa deve ter pelo menos 3 caracteres',
            field: 'titulo',
            timestamp: new Date().toISOString()
        });
    }
    
    if (titulo.length > 150) {
        return res.status(400).json({
            success: false,
            error: 'Título da tarefa não pode exceder 150 caracteres',
            field: 'titulo',
            timestamp: new Date().toISOString()
        });
    }
    
    if (descricao && descricao.length > 1000) {
        return res.status(400).json({
            success: false,
            error: 'Descrição não pode exceder 1000 caracteres',
            field: 'descricao',
            timestamp: new Date().toISOString()
        });
    }
    
    // Sanitização dos dados
    req.body.titulo = titulo.trim();
    req.body.descricao = descricao ? descricao.trim() : '';
    
    next();
};

/**
 * Middleware para validar ID de MongoDB
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const validarId = (req, res, next) => {
    const { id } = req.params;
    
    // Verifica se é um ObjectId válido do MongoDB
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            error: 'ID inválido fornecido',
            field: 'id',
            timestamp: new Date().toISOString()
        });
    }
    
    next();
};

/**
 * Middleware de tratamento de erros padrão
 * @param {Error} error - Erro capturado
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const tratarErros = (error, req, res, next) => {
    console.error('❌ Erro capturado pelo middleware:', error);
    
    // Erro de validação do Mongoose
    if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => ({
            field: err.path,
            message: err.message
        }));
        
        return res.status(400).json({
            success: false,
            error: 'Dados inválidos',
            details: errors,
            timestamp: new Date().toISOString()
        });
    }
    
    // Erro de cast do Mongoose (ID inválido)
    if (error.name === 'CastError') {
        return res.status(400).json({
            success: false,
            error: 'ID inválido fornecido',
            field: error.path,
            timestamp: new Date().toISOString()
        });
    }
    
    // Erro de duplicação (chave única)
    if (error.code === 11000) {
        return res.status(409).json({
            success: false,
            error: 'Registro já existe',
            field: Object.keys(error.keyPattern)[0],
            timestamp: new Date().toISOString()
        });
    }
    
    // Erro genérico
    res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Algo deu errado',
        timestamp: new Date().toISOString()
    });
};

module.exports = {
    validarProjeto,
    validarTarefa,
    validarId,
    tratarErros
};