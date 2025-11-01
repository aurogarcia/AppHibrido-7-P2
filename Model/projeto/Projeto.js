/**
 * MODELO DE PROJETO
 * =================
 * 
 * Modelo Mongoose para gerenciamento de projetos na aplicação.
 * Define a estrutura de dados e validações para projetos.
 */

const mongoose = require('mongoose');

/**
 * Schema do Projeto
 * Defines a estrutura e validações dos dados do projeto
 */
const ProjetoSchema = new mongoose.Schema(
    {
        nome: { 
            type: String, 
            required: [true, 'Nome do projeto é obrigatório'],
            trim: true,
            minlength: [3, 'Nome deve ter pelo menos 3 caracteres'],
            maxlength: [100, 'Nome não pode exceder 100 caracteres'],
            unique: true,
            index: true
        },
        descricao: { 
            type: String, 
            default: '',
            trim: true,
            maxlength: [500, 'Descrição não pode exceder 500 caracteres']
        },
        status: {
            type: String,
            enum: ['ativo', 'pausado', 'concluido', 'cancelado'],
            default: 'ativo',
            index: true
        },
        prioridade: {
            type: String,
            enum: ['baixa', 'media', 'alta', 'critica'],
            default: 'media'
        },
        dataInicio: {
            type: Date,
            default: Date.now
        },
        dataFim: {
            type: Date,
            validate: {
                validator: function(value) {
                    // Data fim deve ser posterior à data início
                    return !value || !this.dataInicio || value > this.dataInicio;
                },
                message: 'Data de fim deve ser posterior à data de início'
            }
        },
        tags: [{
            type: String,
            trim: true,
            lowercase: true
        }],
        // Metadados do projeto
        meta: {
            totalTarefas: {
                type: Number,
                default: 0,
                min: 0
            },
            tarefasConcluidas: {
                type: Number,
                default: 0,
                min: 0
            },
            progresso: {
                type: Number,
                default: 0,
                min: 0,
                max: 100
            }
        }
    },
    { 
        timestamps: true,
        // Configurações do schema
        toJSON: { 
            virtuals: true,
            transform: function(doc, ret) {
                delete ret.__v;
                return ret;
            }
        },
        toObject: { virtuals: true }
    }
);

/**
 * ÍNDICES PARA PERFORMANCE
 */
ProjetoSchema.index({ nome: 'text', descricao: 'text' }); // Busca textual
ProjetoSchema.index({ createdAt: -1 }); // Ordenação por data de criação
ProjetoSchema.index({ status: 1, prioridade: -1 }); // Filtros por status e prioridade

/**
 * VIRTUALS
 * Campos calculados dinamicamente
 */

// Percentual de progresso calculado
ProjetoSchema.virtual('progressoCalculado').get(function() {
    if (this.meta.totalTarefas === 0) return 0;
    return Math.round((this.meta.tarefasConcluidas / this.meta.totalTarefas) * 100);
});

// Status formatado para exibição
ProjetoSchema.virtual('statusFormatado').get(function() {
    const statusMap = {
        'ativo': '🟢 Ativo',
        'pausado': '🟡 Pausado',
        'concluido': '✅ Concluído',
        'cancelado': '❌ Cancelado'
    };
    return statusMap[this.status] || this.status;
});

// Prioridade formatada
ProjetoSchema.virtual('prioridadeFormatada').get(function() {
    const prioridadeMap = {
        'baixa': '🟢 Baixa',
        'media': '🟡 Média',
        'alta': '🟠 Alta',
        'critica': '🔴 Crítica'
    };
    return prioridadeMap[this.prioridade] || this.prioridade;
});

/**
 * MIDDLEWARES PRE-SAVE
 * Executados antes de salvar o documento
 */

// Atualiza o progresso antes de salvar
ProjetoSchema.pre('save', function(next) {
    if (this.meta.totalTarefas > 0) {
        this.meta.progresso = Math.round((this.meta.tarefasConcluidas / this.meta.totalTarefas) * 100);
    }
    next();
});

// Normaliza tags antes de salvar
ProjetoSchema.pre('save', function(next) {
    if (this.tags && this.tags.length > 0) {
        this.tags = [...new Set(this.tags.filter(tag => tag && tag.trim()))]; // Remove duplicatas e vazios
    }
    next();
});

/**
 * MÉTODOS ESTÁTICOS
 * Métodos que podem ser chamados diretamente no modelo
 */

// Buscar projetos por status
ProjetoSchema.statics.buscarPorStatus = function(status) {
    return this.find({ status }).sort({ createdAt: -1 });
};

// Buscar projetos por prioridade
ProjetoSchema.statics.buscarPorPrioridade = function(prioridade) {
    return this.find({ prioridade }).sort({ createdAt: -1 });
};

// Estatísticas gerais
ProjetoSchema.statics.obterEstatisticas = async function() {
    const stats = await this.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                progressoMedio: { $avg: '$meta.progresso' }
            }
        }
    ]);
    
    const total = await this.countDocuments();
    
    return {
        total,
        porStatus: stats,
        resumo: {
            ativo: stats.find(s => s._id === 'ativo')?.count || 0,
            pausado: stats.find(s => s._id === 'pausado')?.count || 0,
            concluido: stats.find(s => s._id === 'concluido')?.count || 0,
            cancelado: stats.find(s => s._id === 'cancelado')?.count || 0
        }
    };
};

/**
 * MÉTODOS DE INSTÂNCIA
 * Métodos que podem ser chamados em uma instância do modelo
 */

// Atualizar progresso do projeto
ProjetoSchema.methods.atualizarProgresso = function() {
    if (this.meta.totalTarefas > 0) {
        this.meta.progresso = Math.round((this.meta.tarefasConcluidas / this.meta.totalTarefas) * 100);
        
        // Auto-completar projeto se todas as tarefas estiverem concluídas
        if (this.meta.progresso === 100 && this.status === 'ativo') {
            this.status = 'concluido';
            this.dataFim = new Date();
        }
    }
    return this.save();
};

// Adicionar tag ao projeto
ProjetoSchema.methods.adicionarTag = function(tag) {
    if (!tag || typeof tag !== 'string') return this;
    
    const tagLimpa = tag.trim().toLowerCase();
    if (tagLimpa && !this.tags.includes(tagLimpa)) {
        this.tags.push(tagLimpa);
    }
    return this;
};

// Remover tag do projeto
ProjetoSchema.methods.removerTag = function(tag) {
    if (!tag || typeof tag !== 'string') return this;
    
    const tagLimpa = tag.trim().toLowerCase();
    this.tags = this.tags.filter(t => t !== tagLimpa);
    return this;
};

module.exports = mongoose.model('Projeto', ProjetoSchema);