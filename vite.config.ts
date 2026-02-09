import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/billing-app-ui/',
  plugins: [react()],
})
