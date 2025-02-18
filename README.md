## Commands to Run

# Setup Instructions

### 1. Start the Backend:
Navigate to the `backend` directory and run the following command:
```bash
cd backend
```
```bash
uvicorn app:app --reload
```

### 2. Start the Frontend:
In a new terminal window, run the following command in the project root:
```bash
yarn
```

```bash
yarn dev
```

This will start the frontend at http://localhost:3000.

# Project Flow

## Frontend Flow (User Input Collection)

1. **Description Text Input**  
2. **Requirements Document Upload**  
3. **Inspiration Images Upload**  
4. **Integration Selection**  

All this data is stored in the [zustand store](src/lib/stores/userInputStore.ts).

## Backend Connection

Your frontend makes API calls to a FastAPI backend (running on `localhost:8000`).  
The API endpoints are defined in `backend/app.py`.

### Three main endpoints:

- **/process-document**: Handles requirement doc uploads  
- **/process-image**: Handles inspiration image uploads  
- **/generate-tasks**: Takes all collected input and generates project plan

## LLM Integration

The backend uses [Ollama](requirements.txt).  
When documents are uploaded:
1. FastAPI receives the file.
2. Processes it based on type (PDF/DOC/Image).
3. Sends content to Ollama for analysis.
4. Returns processed text back to frontend.

## Task Generation Flow

When you click "Continue" on the integrations page:

1. Frontend collects all data from zustand store:
   - Description text
   - Processed requirements
   - Processed inspiration images
   - Selected integrations
2. Sends this to `/generate-tasks` endpoint.
3. Backend aggregates this data and prompts Ollama.
4. Ollama generates structured project plan.
5. Backend formats and returns tasks.
6. Frontend displays tasks in `ProjectPlan` component.

## Data Storage

- **Temporary**: zustand store with localStorage persistence.
- **No permanent storage** currently implemented.
- **File uploads** are processed but not stored.

## Architecture Overview

This is a client-server architecture:

- **Frontend** (Vite/React) handles UI and state.
- **Backend** (FastAPI) handles file processing and LLM interaction.
- **Ollama** serves as the LLM engine.
- All communication happens via HTTP endpoints.

### Key Connection Points:

- **src/lib/services/api.ts** (frontend API calls)
- **backend/app.py** (backend endpoints)
- **src/lib/stores/userInputStore.ts** (state management)

---



