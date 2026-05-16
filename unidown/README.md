# UniDown — Universal Video Downloader

Download and stream videos from 1000+ sites using yt-dlp.

> ⚠️ For personal/educational use only. Respect the terms of service of sites you use this with.

## Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Stack
- Backend: Python, FastAPI, yt-dlp
- Frontend: React, Vite, Plyr
