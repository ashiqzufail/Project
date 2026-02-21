# Lost & Found System - Project Documentation

## 1. Project Overview
This project is an AI-powered "Lost & Found" application designed for colleges/communities. It helps users report lost items, report found items, and finds matches using both text-based and visual AI (image embedding) techniques. It also includes a facility to request CCTV footage for specific locations.

## 2. Technology Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Framework**: Flask (Python)
- **Database**: SQLite (SQLAlchemy)
- **Vector Database**: ChromaDB (for image matching)
- **AI Model**: CLIP (via `sentence-transformers`) for image embeddings
- **Authentication**: JWT (JSON Web Tokens)

## 3. Features

### 3.1 Authentication
- **User Registration**: Users can sign up with username, email, and password.
- **User Login**: Secure login with JWT token generation.
- **Protected Routes**: Dashboard and reporting features require login.

### 3.2 Lost & Found Reporting
- **Report Lost Item**: Users can submit details (Category, Name, Description, Image, Location, Date/Time).
- **Report Found Item**: Finders can submit details of items they found.
- **Vector Search**: Uploaded images are embedded using the CLIP model and stored in ChromaDB to enable visual similarity search.

### 3.3 AI Matching System
The system uses a hybrid matching approach:
1.  **Text Matching**: Checks for category match and fuzzy matches on color/description.
2.  **Visual Matching**: Uses Cosine Similarity on image embeddings to find visually similar items (e.g., a black wallet image matches another black wallet image).
3.  **Notifications**: Users receive notifications on their dashboard when a potential match is found.

### 3.4 CCTV Request
- **Request Footage**: Users can request CCTV footage if they can't find their item.
- **Input**: Specific Location, Date, Start Time, End Time.
- **Validation**: Strict validation ensures all fields are provided.
- **Hardware Check**: The backend simulates a hardware check. Only locations containing "server" or "camera" (case-insensitive) are considered to have connected hardware.
    - *Success*: "Request submitted successfully."
    - *Warning*: "Request sent successfully, but no CCTV hardware was found..."

## 4. Setup & Installation

### Prerequisites
- Node.js & npm
- Python 3.9+

### Backend Setup
1.  Navigate to `backend`:
    ```bash
    cd backend
    ```
2.  Create virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Run the server:
    ```bash
    python app.py
    ```
    *Server runs on http://127.0.0.1:5000*

### Frontend Setup
1.  Navigate to `frontend`:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    # If prompted about vulnerabilities, run 'npm audit fix'
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
    *App runs on http://localhost:5173*

## 5. API Endpoints

### Auth (`/api/auth`)
- `POST /register`: Create new user.
- `POST /login`: Authenticate user.
- `GET /me`: Get current user info.

### Items (`/api/items`)
- `POST /lost`: Report lost item (simulates image upload/embedding).
- `GET /lost`: List all lost items.
- `POST /found`: Report found item.
- `GET /found`: List all found items.
- `GET /notifications`: Get match notifications for the current user.

### CCTV (`/api/cctv`)
- `POST /request`: Submit a CCTV footage request.
    - *Body*: `{ location, date, startTime, endTime }`
    - *Response*: JSON with `hardware_found` status.
- `GET /my-requests`: View user's past requests.

## 6. Project Structure

```
Collage Project-1/
├── backend/
│   ├── app.py              # Entry point
│   ├── models.py           # Database models (User, LostItem, FoundItem, CCTVRequest)
│   ├── config.py           # Configuration
│   ├── vector_utils.py     # ChromaDB & CLIP integration
│   ├── requirements.txt    # Python dependencies
│   ├── routes/             # API blueprints
│   │   ├── auth.py
│   │   ├── items.py
│   │   └── cctv.py
│   └── chroma_db/          # Vector database storage
├── frontend/
│   ├── src/
│   │   ├── pages/          # React pages (Home, Login, etc.)
│   │   ├── components/     # Reusable components (CCTVRequestModal, etc.)
│   │   ├── App.jsx         # Main router setup
│   │   └── main.jsx        # Entry point
│   └── package.json        # Node dependencies
└── README.md               # Quick start guide
└── documentation.md        # This documentation
```
