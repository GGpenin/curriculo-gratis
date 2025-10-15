import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ATENÇÃO: Substitua '<NOME-DO-SEU-REPOSITORIO>' pelo nome real do seu repositório no GitHub.
  base: '/<NOME-DO-SEU-REPOSITORIO>/',
  define: {
    // Passa a variável de ambiente para o código do cliente de forma segura durante o build
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
})
