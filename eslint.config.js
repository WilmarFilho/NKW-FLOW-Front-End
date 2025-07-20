import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // 1. Configurações Globais (aplicadas a todos os arquivos)
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser, // Globais para ambiente de navegador (window, document, etc.)
        ...globals.node,    // Globais para ambiente Node.js (process, require, etc.)
      },
    },
  },
  
  // 2. Regras personalizadas aplicadas a todos os arquivos
  {
    rules: {
      // Força o uso de aspas simples (') em vez de duplas (')
      'quotes': ['error', 'single', { 'avoidEscape': true }],
      // Desativa a regra de variáveis não utilizadas do ESLint base para dar preferência à do TypeScript
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { 
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'caughtErrorsIgnorePattern': '^_'
      }],
    },
  },

  // 3. Configurações específicas para React (apenas para arquivos .jsx e .tsx)
  {
    files: ['**/*.{jsx,tsx}'],
    ...pluginReact.configs.flat.recommended,    // Contém as regras essenciais de boas práticas do React
    ...pluginReact.configs.flat['jsx-runtime'], // Remove a necessidade de 'import React'
    settings: {
      react: {
        version: 'detect', // Detecta automaticamente a versão do React do seu projeto
      },
    },
  },
]);