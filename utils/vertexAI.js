/**
 * Vertex AI Initialization Utility
 * Explicitly configured for serverless environments (no auto-inference)
 */

const { VertexAI } = require('@google-cloud/vertexai');
const path = require('path');
const fs = require('fs');

let vertexInstance = null;
let generativeModel = null;

/**
 * Gets or creates the Vertex AI instance with explicit configuration.
 * Never relies on auto-inference for project ID.
 */
function getVertexAI() {
  if (vertexInstance) {
    return vertexInstance;
  }

  // --- 1. RESOLVE PROJECT ID EXPLICITLY ---
  const projectId = process.env.GCLOUD_PROJECT || process.env.PROJECT_ID;
  
  if (!projectId) {
    throw new Error(
      'CRITICAL: Neither GCLOUD_PROJECT nor PROJECT_ID is defined. ' +
      'Vertex AI cannot auto-infer project in serverless environments.'
    );
  }

  // --- 2. RESOLVE LOCATION (with fallback) ---
  const location = process.env.GCLOUD_LOCATION || 'us-central1';

  // --- 3. RESOLVE AUTH OPTIONS ---
  let googleAuthOptions = {};

  if (process.env.SERVICE_ACCOUNT_JSON) {
    // Priority 1: Load credentials from environment variable (Production/Vercel)
    console.log('🔑 Loading GCloud credentials from SERVICE_ACCOUNT_JSON env var');
    try {
      googleAuthOptions.credentials = JSON.parse(process.env.SERVICE_ACCOUNT_JSON);
    } catch (error) {
      throw new Error(
        'SERVICE_ACCOUNT_JSON contains invalid JSON. ' +
        'Ensure the entire JSON is properly escaped in Vercel Dashboard. ' +
        'Parse error: ' + error.message
      );
    }
  } else {
    // Priority 2: Fall back to local file (Development mode)
    const KEY_PATH = path.join(__dirname, '../service-account.json');
    
    if (fs.existsSync(KEY_PATH)) {
      console.log('🔑 Loading GCloud credentials from local file:', KEY_PATH);
      googleAuthOptions.keyFile = KEY_PATH;
    } else {
      throw new Error(
        'Google Credentials not found. ' +
        'Set SERVICE_ACCOUNT_JSON in Vercel Dashboard or provide service-account.json locally.'
      );
    }
  }

  // --- 4. INITIALIZE WITH EXPLICIT CONFIG (no auto-inference) ---
  console.log(`🚀 Initializing Vertex AI - Project: ${projectId}, Location: ${location}`);
  
  vertexInstance = new VertexAI({
    project: projectId,
    location: location,
    googleAuthOptions: googleAuthOptions,
  });

  return vertexInstance;
}

/**
 * Gets the generative model instance (singleton pattern).
 * @param {string} modelName - Model to use (default: gemini-2.0-flash-exp)
 */
function getGenerativeModel(modelName = 'gemini-2.0-flash-exp') {
  if (generativeModel) {
    return generativeModel;
  }

  const vertex = getVertexAI();
  generativeModel = vertex.preview.getGenerativeModel({
    model: modelName,
  });

  return generativeModel;
}

/**
 * Resets the Vertex AI instances (useful for testing or reinitialization).
 */
function resetVertexAI() {
  vertexInstance = null;
  generativeModel = null;
}

module.exports = { getVertexAI, getGenerativeModel, resetVertexAI };
