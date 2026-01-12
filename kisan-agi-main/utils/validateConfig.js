/**
 * Environment Configuration Validator
 * Fail-fast utility for serverless deployments (Vercel)
 */

const REQUIRED_ENV_VARS = [
  'MONGO_URI',
  'SERVICE_ACCOUNT_JSON',
];

// At least one of these must be present for GCloud project
const GCLOUD_PROJECT_VARS = ['GCLOUD_PROJECT', 'PROJECT_ID'];

/**
 * Validates all required environment variables are present.
 * Throws an explicit error if any are missing.
 * Call this at application startup before any initialization.
 */
function validateConfig() {
  const missingVars = [];

  // Check required vars
  for (const varName of REQUIRED_ENV_VARS) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  // Check GCloud project (at least one must be present)
  const hasGCloudProject = GCLOUD_PROJECT_VARS.some(v => !!process.env[v]);
  if (!hasGCloudProject) {
    missingVars.push(`GCLOUD_PROJECT or PROJECT_ID`);
  }

  // Optional but recommended: GCLOUD_LOCATION
  if (!process.env.GCLOUD_LOCATION) {
    console.warn('⚠️  GCLOUD_LOCATION not set. Defaulting to "us-central1".');
  }

  // Throw if any are missing
  if (missingVars.length > 0) {
    const errorMsg = missingVars
      .map(name => `CRITICAL: Missing Environment Variable: ${name}`)
      .join('\n');
    
    console.error('❌ Configuration Validation Failed:\n' + errorMsg);
    throw new Error(errorMsg);
  }

  console.log('✅ Configuration validated successfully.');
  return true;
}

/**
 * Returns a list of defined environment variable keys (not values) for health checks.
 * This is safe to expose as it only shows key names.
 */
function getDefinedEnvKeys() {
  const keysToCheck = [
    'MONGO_URI',
    'GCLOUD_PROJECT',
    'PROJECT_ID',
    'GCLOUD_LOCATION',
    'SERVICE_ACCOUNT_JSON',
    'GOOGLE_MAPS_API_KEY',
    'PORT',
    'NODE_ENV',
  ];

  return keysToCheck.reduce((acc, key) => {
    acc[key] = !!process.env[key] ? '✓ defined' : '✗ missing';
    return acc;
  }, {});
}

module.exports = { validateConfig, getDefinedEnvKeys };
