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

## Como Publicar no GitHub Pages

Este projeto está configurado para ser publicado no GitHub Pages de forma automatizada usando GitHub Actions. Siga os passos abaixo:

### Passo 1: Configurar o Repositório

1.  **Crie um repositório no GitHub** e envie o código deste projeto para ele.

2.  **Atualize os arquivos de configuração:**
    *   Abra o arquivo `vite.config.ts` e altere a linha `base: '/<NOME-DO-SEU-REPOSITORIO>/',` para o nome do seu repositório. Por exemplo, se seu repositório se chama `meu-curriculo-app`, a linha deve ser `base: '/meu-curriculo-app/',`.

### Passo 2: Adicionar a Chave da API (API_KEY)

Para que a funcionalidade de IA funcione, você precisa fornecer sua chave da API do Google Gemini de forma segura.

1.  No seu repositório do GitHub, vá para **Settings** > **Secrets and variables** > **Actions**.
2.  Clique em **New repository secret**.
3.  No campo **Name**, digite `API_KEY`.
4.  No campo **Value**, cole a sua chave da API do Google Gemini.
5.  Clique em **Add secret**.

O workflow do GitHub Actions usará essa chave durante o processo de build sem expô-la no código público.

### Passo 3: Ativar o GitHub Pages

1.  Envie suas alterações para o repositório (`git push`). O GitHub Action será executado automaticamente.
2.  No seu repositório, vá para **Settings** > **Pages**.
3.  Na seção **Build and deployment**, altere a **Source** de `Deploy from a branch` para `GitHub Actions`.
4.  Após a primeira execução bem-sucedida do workflow, seu site estará disponível no endereço `https://<SEU-USUARIO>.github.io/<NOME-DO-SEU-REPOSITORIO>/`.

Pronto! Seu aplicativo será atualizado automaticamente toda vez que você enviar novas alterações para a branch `main`.
