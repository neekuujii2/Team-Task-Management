import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Debug: Log environment
console.log('🚀 Frontend Server Starting...');
console.log('📁 Serving from:', path.join(__dirname, 'dist'));
console.log('🔌 Port:', port);
console.log('🔗 API URL:', process.env.VITE_API_URL || 'not set');

// Check if dist folder exists
import { existsSync } from 'fs';
const distPath = path.join(__dirname, 'dist');
if (!existsSync(distPath)) {
  console.error('❌ ERROR: dist folder not found at', distPath);
  console.error('❌ Please run: npm run build');
  process.exit(1);
}

// Serve static files from the dist folder
app.use(express.static(distPath));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'frontend' });
});

// Handle React Router - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`✅ Frontend server running on port ${port}`);
});
