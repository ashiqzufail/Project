# Collage Project

This project consists of a Flask backend and a React (Vite) frontend.

## Prerequisites

- Node.js and npm
- Python 3
- Virtualenv (optional but recommended)

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment (if not already acting using the existing one):
   ```bash
   # Create venv
   python3 -m venv venv
   
   # Activate venv (Mac/Linux)
   source venv/bin/activate
   
   # Activate venv (Windows)
   venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   *(Note: If `requirements.txt` is missing, ensure you have Flask and other necessary packages installed)*

4. Run the backend server:
   ```bash
   python app.py
   ```
   The backend typically runs on `http://localhost:5000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on the URL shown in the terminal (usually `http://localhost:5173`).

## Project Structure

- `backend/`: Flask application files (API, database models, etc.)
- `frontend/`: React application files
