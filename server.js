const express = require('express');
const dotenv = require('dotenv');

// Load environment variables FIRST
dotenv.config();

// Import utilities
const { validateConfig, getDefinedEnvKeys } = require('./utils/validateConfig');
const { connectDatabase } = require('./utils/database');

// --- 1. FAIL-FAST VALIDATION ---
// Validate configuration before initializing anything
try {
  validateConfig();
} catch (error) {
  console.error('🚨 Server startup aborted due to configuration error.');
  // In serverless, we still need to export the app, but routes will fail gracefully
  if (require.main === module) {
    process.exit(1);
  }
}

const app = express();
app.use(express.json());

// --- 2. DATABASE CONNECTION (with error handling) ---
// Connect to MongoDB - this is async but we don't block app initialization
// for serverless compatibility. Connection will be established on first request.
connectDatabase().catch((err) => {
  console.error('🚨 Initial database connection failed:', err.message);
  // Don't exit - let the app start and handle errors per-request
});

// --- 3. HEALTH CHECK ROUTE ---
// Diagnostic endpoint to verify environment configuration
app.get('/api/health-check', async (req, res) => {
  const envStatus = getDefinedEnvKeys();
  
  // Optionally check DB connection status
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus,
    envVariables: envStatus,
  });
});

// --- 4. APPLICATION ROUTES ---
app.use('/api/diagnose', require('./routes/diagnose'));
app.use('/api/dealers', require('./routes/dealers'));

// --- 5. 404 HANDLER ---
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// --- 6. GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error('🚨 Unhandled Error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// --- 7. ROOT ROUTE ---
app.get("/", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running 🚀" });
});

// --- 8. LOCAL DEVELOPMENT SERVER ---
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health-check`);
  });
}

module.exports = app;
