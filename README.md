# AI Resume Builder

Este é um aplicativo para construção de currículos com a ajuda de Inteligência Artificial, criado para ser rápido, moderno e fácil de usar.

## Como Executar Localmente

1.  **Instale as dependências:**
    ```bash
    npm install
    ```

2.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    Isso iniciará o aplicativo localmente, geralmente em `http://localhost:5173`. O aplicativo irá recarregar automaticamente quando você fizer alterações no código.

## Como Publicar (Deploy Manual)

O processo de deploy automático foi desativado. Para publicar seu site, você precisa gerar os arquivos estáticos e enviá-los para um serviço de hospedagem de sua escolha (como GitHub Pages, Vercel, Netlify, etc.).

### Passo 1: Fornecer a Chave da API (API_KEY)

Para que a funcionalidade de IA funcione no site publicado, você **precisa** fornecer sua chave da API do Google Gemini durante o processo de build.

### Passo 2: Gerar os Arquivos do Site (Build)

Execute o seguinte comando no seu terminal. Substitua `SUA_CHAVE_API_AQUI` pela sua chave real do Google Gemini.

**No macOS/Linux:**
```bash
API_KEY=SUA_CHAVE_API_AQUI npm run build
```

**No Windows (Command Prompt):**
```bash
set API_KEY=SUA_CHAVE_API_AQUI&& npm run build
```

**No Windows (PowerShell):**
```bash
$env:API_KEY="SUA_CHAVE_API_AQUI"; npm run build
```

Este comando irá criar uma pasta chamada `dist` no seu projeto.

### Passo 3: Enviar para Hospedagem

A pasta `dist` contém todos os arquivos HTML, CSS e JavaScript prontos para produção.

Você pode agora pegar o **conteúdo** desta pasta e arrastá-lo para a interface do seu serviço de hospedagem preferido ou seguir as instruções específicas deles para fazer o deploy de um site estático.
