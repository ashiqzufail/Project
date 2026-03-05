# AI-Powered Lost & Found Network

This project is an intelligent Lost & Found system featuring a Flask backend with vector-based image matching (CLIP) and a modern React (Vite) frontend.

## Features
- **Intelligent Matching**: Uses CLIP (Contrastive Language-Image Pre-training) to match lost and found items visually.
- **Role-Based Access**: Separate dashboards for Users and Admins.
- **CCTV Request System**: Integrated workflow for requesting and managing CCTV footage.
- **Real-time Notifications**: Instant matching notifications based on text and visual similarity.

## Prerequisites
- **Python 3.9+**
- **Node.js 18+**
- **npm** or **yarn**

## Getting Started

### 1. Project Initialization
```bash
git clone <repository-url>
cd "Collage Project-1"
```

### 2. Backend Setup
```bash
cd backend
# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate  # Mac/Linux
# .venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Run the server
python app.py
```
*The backend runs on `http://localhost:5001`.*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*The frontend runs on `http://localhost:5173`.*

## Verification
You can run the automated test suite to verify the installation:
```bash
cd backend
# With venv activated
python test_auth.py
python test_lost.py
python test_match.py
```

## Tech Stack
- **Frontend**: React, Vite, Framer Motion, Tailwind CSS, Lucide React.
- **Backend**: Flask, SQLAlchemy (SQLite), Flask-JWT-Extended.
- **AI/ML**: ChromaDB, Sentence-Transformers (CLIP), Pillow, NumPy.
