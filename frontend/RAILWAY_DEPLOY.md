# Railway Frontend Deploy

Use these Railway settings for the frontend service in this monorepo.

## Service settings

- Branch: `frontend-railway-deploy`
- Root Directory: `frontend`
- Build Command: `npm run build`
- Start Command: `npm start`

## Environment variable

```bash
VITE_API_URL=https://team-task-management-production.up.railway.app/api
```

## Notes

- The frontend build is served by `frontend/server.js`.
- `npm start` serves the built `dist` folder and supports React Router fallback.
- After the first deploy, open the generated Railway domain and test login, dashboard, projects, and tasks.
