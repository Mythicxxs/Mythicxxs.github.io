# UniDown Backend — Deploy to Render (Free)

## Steps (takes ~5 minutes)

1. Go to [render.com](https://render.com) and sign up (free, no credit card)

2. Click **New → Web Service**

3. Connect your GitHub repo

4. Set these fields:
   - **Root Directory:** `unidown/backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

5. Click **Deploy**

6. Once deployed, Render gives you a URL like:
   `https://your-app-name.onrender.com`

7. Open `unidown.html` and replace `YOUR_BACKEND_URL` with that URL:
   ```js
   const BACKEND = 'https://your-app-name.onrender.com';
   ```

8. Commit and push — done!

## Notes
- Free Render instances sleep after 15 min of inactivity (first request takes ~30s to wake)
- Upgrade to a paid plan ($7/mo) to keep it always-on
