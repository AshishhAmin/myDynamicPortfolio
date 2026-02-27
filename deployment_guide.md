# Portfolio Live Deployment Guide 🚀

Follow these steps to deploy your cyber-premium portfolio to the web securely.

## 1. Prepare for Deployment

### GitHub Repository
If you haven't already, push your code to a **private** GitHub repository.
```bash
git add .
git commit -m "feat: security upgrade & deployment prep"
git push origin main
```

## 2. Backend Deployment (Render.com)
I recommend **Render** because it handles Node.js/Express perfectly.

1.  Create an account on [Render.com](https://render.com).
2.  Click **New +** > **Web Service**.
3.  Connect your GitHub repository.
4.  **Settings**:
    *   **Root Directory**: `server`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node index.js`
5.  **Environment Variables**: 
    Click "Advanced" > "Add Environment Variable" and add:
    *   `DATABASE_URL`: (Paste your Neon connection string)
    *   `CLOUDINARY_CLOUD_NAME`: ...
    *   `CLOUDINARY_API_KEY`: ...
    *   `CLOUDINARY_API_SECRET`: ...
    *   `ADMIN_PASSWORD`: (Your secret login password)
    *   `ADMIN_TOKEN`: (A long random string, e.g., `ashish_secure_9922`)
    *   `GITHUB_USERNAME`: `AshishhAmin`
6.  Click **Create Web Service**.

## 3. Frontend Deployment (Vercel)
Vercel is the best for React/Vite apps.

1.  Connect your GitHub repo to [Vercel](https://vercel.com).
2.  **Settings**:
    *   **Framework Preset**: `Vite`
    *   **Root Directory**: `client`
3.  **Environment Variables**:
    *   Click "Add Environment Variable" and add:
        *   `VITE_API_URL`: Paste your **Render URL** (e.g., `https://my-api.onrender.com`).
    *   *I have automated the code so this single setting will update all 18 files on your site automatically!*

## 4. Security Checklist ✅
- [ ] **Change the Password**: Make sure `ADMIN_PASSWORD` in Render is NOT `admin123`.
- [ ] **Private Repo**: Ensure your code is not public if it contains sensitive config (though we moved most to env vars).
- [ ] **SSL**: Both Render and Vercel provide SSL (HTTPS) automatically.

## 5. Troubleshooting
If the Admin Dashboard says "Unauthorized", check that the `ADMIN_TOKEN` in your Render settings matches the one being used in your code (or just ensure it's provided in Render).
