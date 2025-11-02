/**
 * SCRIPT PARA POPULAR BANCO DE DADOS
 * ==================================
 * 
 * Script para inserir tarefas de exemplo no MongoDB
 * 
 * @author Sistema Híbrido
 * @version 1.0.0
 */

const mongoose = require('mongoose');
const Tarefa = require('./Model/projeto/Tarefa');

// Configuração da conexão (mesma do index.js)
const MONGODB_URI = 'mongodb+srv://aurogarcia833_db_user:pygDbBDx2RKNI64P@cluster0.d7wazmx.mongodb.net/AppHibrido7P2?retryWrites=true&w=majority&appName=Cluster0';

/**
 * Tarefas de exemplo para popular o banco
 */
const tarefasExemplo = [
    {
        titulo: 'Configurar ambiente de desenvolvimento',
        descricao: 'Instalar Node.js, npm, MongoDB e configurar o projeto inicial com todas as dependências necessárias',
        concluida: true,
        prioridade: 'alta',
        categoria: 'setup',
        responsavel: 'Desenvolvedor Principal',
        tempoEstimado: '2h',
        dataConclusao: new Date('2024-10-01'),
        tags: ['configuração', 'setup', 'nodejs'],
        observacoes: 'Ambiente configurado com sucesso. Todas as dependências instaladas.'
    },
    {
        titulo: 'Criar sistema de rotas Express.js',
        descricao: 'Implementar todas as rotas do Express.js para páginas web e endpoints da API REST',
        concluida: true,
        prioridade: 'alta',
        categoria: 'backend',
        responsavel: 'Desenvolvedor Backend',
        tempoEstimado: '3h',
        dataConclusao: new Date('2024-10-02'),
        tags: ['express', 'rotas', 'api'],
        observacoes: 'Sistema de rotas implementado com middleware de validação.'
    },
    {
        titulo: 'Implementar operações CRUD para tarefas',
        descricao: 'Desenvolver todas as operações Create, Read, Update e Delete para o gerenciamento de tarefas',
        concluida: true,
        prioridade: 'alta',
        categoria: 'backend',
        responsavel: 'Desenvolvedor Full-Stack',
        tempoEstimado: '4h',
        dataConclusao: new Date('2024-10-28'),
        tags: ['crud', 'mongodb', 'mongoose'],
        observacoes: 'CRUD completo implementado com validações e tratamento de erros.'
    },
    {
        titulo: 'Criar interface web responsiva',
        descricao: 'Desenvolver interface moderna usando EJS templates com design responsivo e interativo',
        concluida: false,
        prioridade: 'alta',
        categoria: 'frontend',
        responsavel: 'Desenvolvedor Frontend',
        tempoEstimado: '5h',
        dataVencimento: new Date('2025-11-10'),
        tags: ['ejs', 'css', 'javascript', 'responsivo'],
        observacoes: 'Interface básica criada, faltam alguns componentes avançados.'
    },
    {
        titulo: 'Implementar sistema de autenticação',
        descricao: 'Adicionar login, logout e controle de sessões de usuário para segurança da aplicação',
        concluida: false,
        prioridade: 'media',
        categoria: 'backend',
        responsavel: 'Desenvolvedor Backend',
        tempoEstimado: '6h',
        dataVencimento: new Date('2025-11-15'),
        tags: ['auth', 'segurança', 'sessão'],
        observacoes: 'Estudando implementação com JWT ou sessions.'
    },
    {
        titulo: 'Escrever testes automatizados',
        descricao: 'Criar suíte de testes unitários e de integração para garantir qualidade do código',
        concluida: false,
        prioridade: 'media',
        categoria: 'teste',
        responsavel: 'QA Engineer',
        tempoEstimado: '4h',
        dataVencimento: new Date('2025-11-20'),
        tags: ['jest', 'testes', 'qualidade'],
        observacoes: 'Definindo estratégia de testes e ferramentas a serem usadas.'
    },
    {
        titulo: 'Otimizar performance da aplicação',
        descricao: 'Analisar e otimizar consultas do banco, cache e performance geral do sistema',
        concluida: false,
        prioridade: 'baixa',
        categoria: 'melhorias',
        responsavel: 'Desenvolvedor Senior',
        tempoEstimado: '3h',
        tags: ['performance', 'cache', 'otimização'],
        observacoes: 'Aguardando conclusão das funcionalidades principais.'
    },
    {
        titulo: 'Documentar API endpoints',
        descricao: 'Criar documentação completa da API REST usando Swagger ou similar',
        concluida: false,
        prioridade: 'baixa',
        categoria: 'documentacao',
        responsavel: 'Tech Writer',
        tempoEstimado: '2h',
        dataVencimento: new Date('2025-11-25'),
        tags: ['swagger', 'documentação', 'api'],
        observacoes: 'Documentação será feita após estabilização da API.'
    },
    {
        titulo: 'Corrigir bug no filtro de tarefas',
        descricao: 'Resolver problema onde filtros por categoria não estão funcionando corretamente',
        concluida: false,
        prioridade: 'urgente',
        categoria: 'bugs',
        responsavel: 'Desenvolvedor Full-Stack',
        tempoEstimado: '1h',
        dataVencimento: new Date('2025-11-03'),
        tags: ['bug', 'filtro', 'categoria'],
        observacoes: 'Bug reportado pelos usuários, precisa ser corrigido urgentemente.'
    },
    {
        titulo: 'Implementar notificações por email',
        descricao: 'Adicionar sistema de notificações por email para tarefas vencidas e lembretes',
        concluida: false,
        prioridade: 'baixa',
        categoria: 'melhorias',
        responsavel: 'Desenvolvedor Backend',
        tempoEstimado: '3h',
        tags: ['email', 'notificação', 'lembrete'],
        observacoes: 'Funcionalidade adicional para melhorar experiência do usuário.'
    }
];

/**
 * Função principal para popular o banco
 */
async function popularBanco() {
    try {
        console.log('🔄 Conectando ao MongoDB...');
        
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ Conectado ao MongoDB!');
        
        // Verificar se já existem tarefas
        const tarefasExistentes = await Tarefa.countDocuments();
        console.log(`📊 Tarefas existentes no banco: ${tarefasExistentes}`);
        
        if (tarefasExistentes > 0) {
            const resposta = require('readline-sync');
            const confirmar = resposta.question('⚠️  Já existem tarefas no banco. Deseja remover todas e inserir os exemplos? (s/N): ');
            
            if (confirmar.toLowerCase() === 's' || confirmar.toLowerCase() === 'sim') {
                console.log('🗑️ Removendo tarefas existentes...');
                await Tarefa.deleteMany({});
                console.log('✅ Tarefas removidas!');
            } else {
                console.log('⏭️ Mantendo tarefas existentes e adicionando novas...');
            }
        }
        
        console.log('➕ Inserindo tarefas de exemplo...');
        
        const tarefasInseridas = await Tarefa.insertMany(tarefasExemplo);
        
        console.log(`✅ ${tarefasInseridas.length} tarefas inseridas com sucesso!`);
        
        // Mostrar estatísticas
        const estatisticas = await Tarefa.obterEstatisticas();
        console.log('\n📈 ESTATÍSTICAS DO BANCO:');
        console.log(`   📋 Total: ${estatisticas.total}`);
        console.log(`   ✅ Concluídas: ${estatisticas.concluidas}`);
        console.log(`   ⏳ Pendentes: ${estatisticas.pendentes}`);
        console.log(`   📊 % Conclusão: ${estatisticas.porcentagemConclusao}%`);
        
        console.log('\n🏷️ POR PRIORIDADE:');
        Object.entries(estatisticas.porPrioridade).forEach(([prioridade, count]) => {
            console.log(`   ${prioridade}: ${count}`);
        });
        
        console.log('\n📂 POR CATEGORIA:');
        Object.entries(estatisticas.porCategoria).forEach(([categoria, count]) => {
            console.log(`   ${categoria}: ${count}`);
        });
        
        console.log('\n🎉 Banco de dados populado com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao popular banco:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Desconectado do MongoDB');
        process.exit(0);
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    popularBanco();
}

module.exports = { popularBanco, tarefasExemplo };