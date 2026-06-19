# Private PDF AI Assistant

A secure, self-hosted web app that lets users upload PDFs and ask questions
about them using a **local** AI model (Ollama + Llama 3). No document content
ever leaves your machine / server — there are no calls to OpenAI, Anthropic,
or any other third-party AI API.

## Architecture

Layered architecture, enforced strictly in the backend:

```
Request → Route → Controller → Service → Repository → Database
```

- **Route**: defines the URL + HTTP method, points to a controller
- **Controller**: reads the request, calls a service, sends the response (no business logic, no SQL)
- **Service**: contains the business logic (validation rules, orchestration, calls to AI/Ollama/ChromaDB)
- **Repository**: the ONLY layer allowed to talk to PostgreSQL directly
- **Database**: PostgreSQL

## Folder Structure

```
backend/src/
├── config/        # env loading, DB pool, future Ollama/Chroma client setup
├── routes/        # Express routers (URL -> controller mapping)
├── controllers/   # request/response handling only
├── services/      # business logic
├── repositories/  # raw SQL / DB queries only
├── middleware/    # auth checks, error handling, etc.
├── validators/    # request body validation rules
├── ai/
│   ├── chunking/    # splitting PDF text into chunks for embedding
│   ├── embeddings/  # calling Ollama's nomic-embed-text model
│   ├── retrieval/   # querying ChromaDB for relevant chunks
│   └── prompts/     # prompt templates sent to Llama 3
├── uploads/       # uploaded PDF files are stored here
└── utils/         # reusable helpers (asyncHandler, ApiError, etc.)

frontend/src/
├── assets/         # images, icons, static files
├── components/     # reusable UI building blocks
├── pages/          # full page views (Login, Dashboard, Chat, etc.)
├── services/        # axios API call functions
├── hooks/          # custom React hooks
├── context/        # React context (e.g. AuthContext)
├── routes/         # React Router route definitions
└── utils/          # reusable frontend helpers
```

## Local Setup (required before running)

1. **PostgreSQL** running locally with a database created (see `backend/.env.example`)
2. **Ollama** installed and running locally (`ollama serve`), with models pulled:
   ```
   ollama pull llama3
   ollama pull nomic-embed-text
   ```
3. **ChromaDB** running locally (e.g. via `pip install chromadb` and `chroma run`)
4. Copy `.env.example` to `.env` in both `backend/` and `frontend/`, and fill in real values
5. Install dependencies:
   ```
   cd backend && npm install
   cd ../frontend && npm install
   ```
6. Run both dev servers:
   ```
   # terminal 1
   cd backend && npm run dev

   # terminal 2
   cd frontend && npm run dev
   ```

## Phase Roadmap

This project is being built incrementally, phase by phase:

1. **Phase 1** – User Registration, Login, JWT Authentication
2. **Phase 2** – Dashboard Layout, Sidebar Navigation
3. **Phase 3** – Upload / View / Delete PDFs
4. **Phase 4** – Extract Text from PDF, Store Document Metadata
5. **Phase 5** – Generate Embeddings, Store Vectors in ChromaDB
6. **Phase 6** – Chat Interface, Ask Questions, Retrieve Chunks, Generate Answers with Ollama
7. **Phase 7** – Chat History, Source References

**Status:** ✅ Scaffold complete (folder structure, base config, error handling,
health-check route, Tailwind/Vite setup). Ready for Phase 1.
