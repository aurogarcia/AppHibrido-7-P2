/**
 * MODELO DE TAREFA
 * ================
 * 
 * Schema do MongoDB/Mongoose para gerenciamento de tarefas
 * 
 * @author Sistema Híbrido
 * @version 2.0.0
 */

const mongoose = require('mongoose');

/**
 * Schema da Tarefa
 */
const TarefaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'Título é obrigatório'],
        trim: true,
        maxlength: [100, 'Título não pode ter mais que 100 caracteres']
    },
    
    descricao: {
        type: String,
        trim: true,
        maxlength: [500, 'Descrição não pode ter mais que 500 caracteres'],
        default: ''
    },
    
    concluida: {
        type: Boolean,
        default: false
    },
    
    prioridade: {
        type: String,
        enum: {
            values: ['baixa', 'media', 'alta', 'urgente'],
            message: 'Prioridade deve ser: baixa, media, alta ou urgente'
        },
        default: 'media'
    },
    
    categoria: {
        type: String,
        enum: {
            values: ['setup', 'backend', 'frontend', 'teste', 'documentacao', 'bugs', 'melhorias', 'outros'],
            message: 'Categoria inválida'
        },
        default: 'outros'
    },
    
    responsavel: {
        type: String,
        trim: true,
        maxlength: [50, 'Nome do responsável não pode ter mais que 50 caracteres'],
        default: 'Não atribuído'
    },
    
    tempoEstimado: {
        type: String,
        trim: true,
        maxlength: [20, 'Tempo estimado não pode ter mais que 20 caracteres'],
        default: '1h'
    },
    
    dataCriacao: {
        type: Date,
        default: Date.now
    },
    
    dataConclusao: {
        type: Date,
        default: null
    },
    
    dataVencimento: {
        type: Date,
        default: null
    },
    
    tags: [{
        type: String,
        trim: true,
        maxlength: [30, 'Tag não pode ter mais que 30 caracteres']
    }],
    
    observacoes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Observações não podem ter mais que 1000 caracteres'],
        default: ''
    },
    
    projeto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projeto',
        default: null,
        index: true
    }
}, {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
    versionKey: false // Remove o campo __v
});

/**
 * Middleware para atualizar dataConclusao quando tarefa for concluída
 */
TarefaSchema.pre('save', function(next) {
    if (this.isModified('concluida')) {
        if (this.concluida && !this.dataConclusao) {
            this.dataConclusao = new Date();
        } else if (!this.concluida) {
            this.dataConclusao = null;
        }
    }
    next();
});

/**
 * Virtual para calcular se a tarefa está atrasada
 */
TarefaSchema.virtual('atrasada').get(function() {
    if (!this.dataVencimento || this.concluida) return false;
    return new Date() > this.dataVencimento;
});

/**
 * Virtual para calcular tempo desde criação
 */
TarefaSchema.virtual('tempoDesdecriacao').get(function() {
    const agora = new Date();
    const criacao = this.dataCriacao;
    const diffMs = agora - criacao;
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDias === 0) return 'Hoje';
    if (diffDias === 1) return 'Ontem';
    if (diffDias < 7) return `${diffDias} dias atrás`;
    if (diffDias < 30) return `${Math.floor(diffDias / 7)} semanas atrás`;
    return `${Math.floor(diffDias / 30)} meses atrás`;
});

/**
 * Método estático para buscar tarefas por status
 */
TarefaSchema.statics.buscarPorStatus = function(concluida = false) {
    return this.find({ concluida });
};

/**
 * Método estático para buscar tarefas por prioridade
 */
TarefaSchema.statics.buscarPorPrioridade = function(prioridade) {
    return this.find({ prioridade });
};

/**
 * Método estático para buscar tarefas por categoria
 */
TarefaSchema.statics.buscarPorCategoria = function(categoria) {
    return this.find({ categoria });
};

/**
 * Método estático para obter estatísticas
 */
TarefaSchema.statics.obterEstatisticas = async function() {
    const total = await this.countDocuments();
    const concluidas = await this.countDocuments({ concluida: true });
    const pendentes = total - concluidas;
    const porcentagemConclusao = total > 0 ? Math.round((concluidas / total) * 100) : 0;
    
    const porPrioridade = await this.aggregate([
        { $group: { _id: '$prioridade', count: { $sum: 1 } } }
    ]);
    
    const porCategoria = await this.aggregate([
        { $group: { _id: '$categoria', count: { $sum: 1 } } }
    ]);
    
    return {
        total,
        concluidas,
        pendentes,
        porcentagemConclusao,
        porPrioridade: porPrioridade.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {}),
        porCategoria: porCategoria.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {})
    };
};

/**
 * Configurar virtuals no JSON
 */
TarefaSchema.set('toJSON', { virtuals: true });
TarefaSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Tarefa', TarefaSchema);
