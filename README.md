# YoutubeRAG 📹🤖

RAG (Retrieval-Augmented Generation) based application that allows users to "chat" with YouTube videos. Simply provide a YouTube URL, and the AI will index the transcript, allowing you to ask questions and get accurate answers based on the video's content.

## 🚀 Features

- **Video Transcription**: Automatically fetches and processes transcripts from YouTube videos.
- **RAG Powered Chat**: Uses Google Gemini and LangChain to provide context-aware answers from the video content.
- **Interactive UI**: Modern, responsive frontend built with React and TailwindCSS.
- **Chat History**: Saves your conversation history for each video.
- **Multi-Video Support**: Switch between different videos and manage your library.
- **Secure Authentication**: User login and signup functionality.

## 🛠️ Tech Stack

This project is a monorepo consisting of three main components:

### 1. Frontend 🎨
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/) + [Material UI](https://mui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State/Networking**: Axios, React Router

### 2. Backend (Auth Service) 🔐
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: PostgreSQL (handling user data)
- **Auth**: JWT (JSON Web Tokens) & Bcrypt

### 3. ML-Backend (AI Service) 🧠
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **LLM**: Google Gemini 2.5 Flash (`langchain-google-genai`)
- **Vector DB**: Pinecone
- **Orchestration**: [LangChain](https://www.langchain.com/)
- **Database**: SQLAlchemy (PostgreSQL) for chat history & video metadata
- **Tools**: `youtube-transcript-api`

---

## 📦 Installation & Setup

### Prerequisites
- Node.js & npm installed
- Python 3.9+ installed
- PostgreSQL database running
- Pinecone Account (for Vector DB)
- Google Cloud API Key (for Gemini)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/YoutubeRAG.git
cd YoutubeRAG
```

### 2. Setup Backend (Node.js)
```bash
cd Backend
npm install
# Configure .env file (see .env.example if available, or set PORT, DB_URI, JWT_SECRET)
npm run dev
```

### 3. Setup ML-Backend (Python)
```bash
cd ML-Backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
# Configure .env file (PINECONE_API_KEY, GOOGLE_API_KEY, DATABASE_URL)
uvicorn main:app --reload
```

### 4. Setup Frontend (React)
```bash
cd Frontend
npm install
# Configure .env (VITE_API_BASE_URL, etc.)
npm run dev
```

## 📝 Environment Variables

Make sure to create `.env` files in each directory with the necessary keys:

**ML-Backend (.env)**
```
PINECONE_API_KEY=your_pinecone_key
GOOGLE_API_KEY=your_google_gemini_key
DATABASE_URL=postgresql://user:password@localhost/dbname
```

**Backend (.env)**
```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost/dbname
JWT_SECRET=your_secret_key
```

**Frontend (.env)**
```
VITE_BACKEND_URL=http://localhost:5000
VITE_ML_BACKEND_URL=http://localhost:8000
```

## 🤝 Contributing
Contributions are welcome! Please fork the repo and submit a PR.
