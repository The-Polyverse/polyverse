import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    includeSource: ['src/**/*.{jsx?,tsx?}'],
    environment: 'happy-dom'
  }
})) 