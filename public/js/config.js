// ===== ENVIRONMENT CONFIGURATION =====

// Configuration for different environments
const CONFIG = {
    development: {
        API_BASE_URL: 'http://127.0.0.1:9090/api',
        APP_NAME: 'Digital Garden Blog (Dev)',
        DEBUG: true
    },
    production: {
        API_BASE_URL: 'https://your-backend-api.com/api', // Replace with your deployed backend
        APP_NAME: 'Digital Garden Blog',
        DEBUG: false
    },
    netlify: {
        API_BASE_URL: '/api', // Uses demo mode for static hosting
        APP_NAME: 'Digital Garden Blog (Demo)',
        DEBUG: false,
        DEMO_MODE: true
    }
};

// Detect environment
function getEnvironment() {
    // Check if running on localhost
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        return 'development';
    }
    
    // Check if running on Netlify
    if (location.hostname.includes('netlify.app') || location.hostname.includes('netlify.com')) {
        return 'netlify';
    }
    
    // Default to production
    return 'production';
}

// Get current configuration
function getConfig() {
    const env = getEnvironment();
    const config = CONFIG[env];
    
    console.log(`🌍 Environment: ${env}`, config);
    return config;
}

// Export for use in other files
window.APP_CONFIG = getConfig();