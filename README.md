# 🗂️ XML Archive Platform

Plataforma de arquivamento de documentos fiscais eletrônicos (NFe e CTe) desenvolvida em Next.js.

## � Como Hospedar Gratuitamente

### Opção 1: Vercel (⭐ Recomendado)

**Por que Vercel?**
- ✅ Criado pela mesma empresa do Next.js
- ✅ Deploy automático do GitHub
- ✅ 100GB bandwidth gratuito
- ✅ Suporte completo a API routes
- ✅ Preview deployments

**Passos para deploy:**
1. Acesse [vercel.com](https://vercel.com)
2. Cadastre-se com sua conta GitHub
3. Clique em "New Project"
4. Selecione este repositório
5. Configure:
   - Framework: `Next.js`
   - Build Command: `npm run build`
6. Deploy! 🚀

### Opção 2: Netlify

**Passos para deploy:**
1. Acesse [netlify.com](https://netlify.com)
2. Cadastre-se com GitHub
3. "New site from Git" → Selecione este repositório
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Deploy!

### Opção 3: Railway

**Passos para deploy:**
1. Acesse [railway.app](https://railway.app)
2. Conecte com GitHub
3. Selecione este repositório
4. Deploy automático!

## 📋 Sobre o Projeto

Plataforma completa para arquivamento digital de documentos fiscais eletrônicos, funcionando como um arquivo morto digital para empresas.

## ✨ Funcionalidades

### 📤 Upload de Documentos
- **Drag & Drop**: Arraste arquivos XML diretamente para a área de upload
- **Seleção de Arquivos**: Interface intuitiva para seleção de múltiplos arquivos
- **Validação**: Aceita apenas arquivos XML válidos
- **Progress Tracking**: Acompanhe o status do upload em tempo real
- **Detecção Automática**: Identifica automaticamente tipos de documento (NFe, CTe)

### 📋 Listagem e Visualização
- **Lista Completa**: Visualize todos os documentos arquivados
- **Informações Detalhadas**: Número do documento, data de emissão, empresa, CNPJ e valores
- **Paginação**: Navegação eficiente através de grandes volumes de documentos
- **Status Visual**: Indicadores coloridos para diferentes tipos de documento

### 🔍 Busca e Filtros
- **Busca Textual**: Pesquise por número do documento, CNPJ ou razão social
- **Filtros por Tipo**: NFe ou CTe
- **Filtros por Ano**: Documentos dos últimos 10 anos
- **Busca Combinada**: Use múltiplos filtros simultaneamente

### 💾 Monitoramento de Armazenamento
- **Uso de Espaço**: Visualize o espaço utilizado vs disponível
- **Estatísticas**: Total de documentos arquivados
- **Métricas Mensais**: Acompanhe uploads do mês atual
- **Alertas**: Notificações quando o espaço está baixo
- **Breakdown por Tipo**: Distribuição entre NFe e CTe

## 🛠 Tecnologias Utilizadas

- **Next.js 13**: Framework React com App Router
- **TypeScript**: Tipagem estática para maior segurança
- **Tailwind CSS**: Framework CSS utilitário para design responsivo
- **Lucide React**: Ícones modernos e consistentes
- **Fast XML Parser**: Processamento eficiente de arquivos XML

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16.20.2 ou superior
- npm ou yarn

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd xml-archive-platform
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Acesse a aplicação**
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador

### Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm start` - Inicia servidor de produção
- `npm run lint` - Executa verificação de código

## 📁 Estrutura do Projeto

```
xml-archive-platform/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── documents/     # API para gerenciamento de documentos
│   │   │   └── storage/       # API para estatísticas de armazenamento
│   │   ├── globals.css        # Estilos globais
│   │   ├── layout.tsx         # Layout principal
│   │   └── page.tsx          # Página inicial
│   └── components/
│       ├── DocumentList.tsx   # Listagem de documentos
│       ├── SearchBar.tsx      # Barra de pesquisa
│       ├── StorageInfo.tsx    # Informações de armazenamento
│       └── UploadArea.tsx     # Área de upload
├── uploads/                   # Diretório de arquivos (criado automaticamente)
└── ...arquivos de configuração
```

## 🎯 Tipos de Documentos Suportados

### NFe (Nota Fiscal Eletrônica)
- Documentos de vendas e prestação de serviços
- Informações de valores, impostos e destinatários
- Validação de estrutura XML específica

### CTe (Conhecimento de Transporte Eletrônico)
- Documentos de transporte de cargas
- Informações de origem, destino e transportadora
- Rastreamento de operações logísticas

## 💡 Funcionalidades Futuras

- [ ] Autenticação e controle de acesso
- [ ] Export de relatórios em PDF/Excel
- [ ] Backup automático em nuvem
- [ ] API REST completa
- [ ] Integração com sistemas ERP
- [ ] Assinatura digital de documentos
- [ ] Histórico de alterações

## 🔧 Configuração Avançada

### Variáveis de Ambiente
Crie um arquivo `.env.local` para configurações personalizadas:

```env
# Configurações de armazenamento
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_DIR=./uploads

# Configurações de API
API_RATE_LIMIT=100
```

### Customização de Upload
O diretório `uploads/` é criado automaticamente na primeira execução. Os arquivos são organizados por data de upload para facilitar a manutenção.

## 📈 Performance e Otimizações

- **Lazy Loading**: Componentes carregados sob demanda
- **Paginação Eficiente**: Apenas dados necessários são carregados
- **Compressão de Imagens**: Otimização automática de assets
- **SSR/SSG**: Renderização otimizada com Next.js

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Se você encontrar algum problema ou tiver sugestões, por favor:

1. Verifique as [Issues existentes](../../issues)
2. Crie uma nova issue com detalhes do problema
3. Inclua informações sobre seu ambiente (OS, Node.js version, etc.)

---

**Desenvolvido para modernizar o arquivamento de documentos fiscais eletrônicos** 📋✨