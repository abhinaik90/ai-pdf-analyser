// config/env.js
// WHY THIS FILE EXISTS:
// Instead of scattering `process.env.SOMETHING` across the codebase,
// we read all environment variables in ONE place. This makes it easy to:
//   1. See every config value the app needs, in one spot
//   2. Catch missing/typo'd variables early
//   3. Provide sensible defaults for local development

require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'pdf_ai_assistant',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'dev_secret_change_me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
  },

  upload: {
    dir: process.env.UPLOAD_DIR || 'src/uploads',
    maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 20,
  },

  ollama: {
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    chatModel: process.env.OLLAMA_CHAT_MODEL || 'llama3',
    embeddingModel: process.env.OLLAMA_EMBEDDING_MODEL || 'nomic-embed-text',
  },

  chroma: {
    url: process.env.CHROMA_URL || 'http://localhost:8000',
    collectionName: process.env.CHROMA_COLLECTION_NAME || 'pdf_chunks',
  },
};

module.exports = config;
