import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Use mode and loadEnv to grab current environment variables from root
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Inject VITE_API_KEY into process.env.API_KEY for Gemini SDK
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY),
    }
  }
})