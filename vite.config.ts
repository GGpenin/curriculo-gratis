import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // A base foi alterada para '/', que é o padrão.
  // Isso gera um build que pode ser hospedado na raiz de qualquer domínio.
  base: '/',
  define: {
    // Passa a variável de ambiente para o código do cliente de forma segura durante o build
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
})