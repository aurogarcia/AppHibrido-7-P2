# 📱 App Híbrido - Gerenciador de Tarefas

Sistema completo de gerenciamento de projetos e tarefas com interface mobile responsiva, desenvolvido com Node.js, Express e MongoDB.

## ✨ Funcionalidades

### 🎯 **Sistema de Prioridades**
- **Baixa**: Tarefas de rotina e não urgentes
- **Média**: Tarefas importantes com prazo flexível  
- **Alta**: Tarefas críticas que requerem atenção
- **Urgente**: Tarefas que precisam ser feitas imediatamente

### 📊 **Gerenciamento Inteligente**
- Criação de projetos com descrição e metadata completa
- Associação de tarefas aos projetos via relacionamentos
- Controle de datas: criação, vencimento e status
- Estatísticas em tempo real de progresso
- Interface unificada para criação centralizada

### 📱 **Design Responsivo**
- 100% compatível com dispositivos móveis
- Interface touch-friendly otimizada para telas pequenas
- Navegação intuitiva e acessível
- Media queries avançadas para múltiplas resoluções

## 🛠 Tecnologias Utilizadas

### **Backend**
- **Node.js v22.14.0**: Runtime JavaScript
- **Express.js**: Framework web minimalista
- **MongoDB Atlas**: Banco de dados NoSQL na nuvem
- **Mongoose ODM**: Modelagem de dados e relacionamentos

### **Frontend**
- **EJS**: Template engine para renderização server-side
- **CSS3**: Animações e layout responsivo avançado
- **JavaScript ES6**: Interatividade e validações client-side
- **Modal System**: Formulários dinâmicos e user-friendly

### **Arquitetura**
- **MVC Pattern**: Model-View-Controller bem estruturado
- **API RESTful**: Endpoints organizados para operações CRUD
- **Service Layer**: Lógica de negócio encapsulada
- **Relacionamentos**: Referencias entre projetos e tarefas

## 🚀 Como Executar

### **1. Pré-requisitos**
```bash
# Node.js 18.x ou superior
node --version

# NPM (vem com Node.js)
npm --version
```

### **2. Instalação**
```bash
# Clone o repositório
git clone https://github.com/SEU-USERNAME/app-hibrido-gerenciador-tarefas.git

# Entre no diretório
cd app-hibrido-gerenciador-tarefas

# Instale as dependências
npm install
```

### **3. Configuração do Banco**
1. Crie uma conta no [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Configure um cluster gratuito
3. Obtenha a string de conexão
4. Crie um arquivo `.env` baseado no `env.example`
5. Configure sua `MONGODB_URI`

### **4. Executar o Projeto**
```bash
# Modo desenvolvimento
npm start

# O servidor estará disponível em:
# http://localhost:3000
```

## 📱 Interfaces do Sistema

### **🏠 Página Inicial** 
- Centro de criação unificado
- Formulários modais para projetos e tarefas
- Acesso rápido às funcionalidades principais
- Estatísticas gerais do sistema

### **📋 Gerenciador de Projetos**
- Listagem completa de todos os projetos
- Visualização de tarefas associadas por projeto
- Exclusão de projetos com limpeza automática de tarefas
- Contadores dinâmicos e estatísticas

### **✅ Gerenciador de Tarefas**
- Interface otimizada para visualização de tarefas
- Filtros por prioridade e status
- Estatísticas em tempo real
- Formatação inteligente de datas brasileiras

## 🗂 Estrutura do Projeto

```
📦 app-hibrido-gerenciador-tarefas/
├── 📁 config/
│   └── database.js              # Configuração MongoDB
├── 📁 Model/projeto/
│   ├── Projeto.js               # Schema do Projeto
│   └── Tarefa.js                # Schema da Tarefa com relacionamentos
├── 📁 routes/
│   ├── api-database.js          # API unificada para CRUD
│   └── pages.js                 # Rotas das páginas web
├── 📁 service/
│   ├── ProjetoService.js        # Lógica de negócio dos projetos
│   └── TarefaService.js         # Lógica de negócio das tarefas
├── 📁 views/
│   ├── layout.ejs               # Template base responsivo
│   ├── index.ejs                # Página inicial unificada
│   ├── projetos.ejs             # Interface de projetos
│   ├── tarefas.ejs              # Interface de tarefas
│   └── 📁 partials/
│       └── header.ejs           # Cabeçalho compartilhado
├── 📁 public/                   # Arquivos estáticos
├── 📄 package.json              # Dependências e scripts
├── 📄 index.js                  # Ponto de entrada da aplicação
└── 📄 README.md                 # Esta documentação
```

## 🎨 Destaques Técnicos

### **🔗 Relacionamentos Inteligentes**
```javascript
// Tarefa referencia Projeto via ObjectId
const tarefaSchema = {
  projeto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Projeto',
    required: true
  }
}
```

### **📱 CSS Mobile-First**
```css
/* Design responsivo avançado */
@media (max-width: 768px) {
  .container { 
    padding: 10px;
    margin: 0;
  }
  
  .button-touch {
    min-height: 44px;  /* Padrão de acessibilidade */
    padding: 12px 16px;
  }
}
```

### **⚡ API Unificada**
```javascript
// Endpoints RESTful organizados
app.get('/api/projetos', listarProjetos);
app.post('/api/projetos', criarProjeto);
app.get('/api/tarefas', listarTarefas);
app.post('/api/tarefas', criarTarefa);
app.delete('/api/projetos/:id', excluirProjeto);
```

## 📈 Funcionalidades Avançadas

### **🏆 Estatísticas Dinâmicas**
- Contagem automática de projetos ativos
- Estatísticas de tarefas por status e prioridade
- Cálculos de produtividade em tempo real
- Indicadores visuais de progresso

### **🗓 Gestão de Datas**
- Formatação brasileira (DD/MM/AAAA)
- Validação de datas de vencimento
- Indicadores visuais de tarefas vencidas
- Funções auxiliares para manipulação segura

### **🎯 Sistema de Prioridades Visual**
- Cores distintas para cada nível de prioridade
- Badges e indicadores visuais intuitivos
- Filtros dinâmicos por prioridade
- Ordenação inteligente por importância

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autor

Desenvolvido com 💙 por [Seu Nome]

---

⭐ **Se este projeto foi útil, considere dar uma estrela no repositório!** ⭐
