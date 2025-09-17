/**
 * Digital Garden Blog - API Client
 * 
 * Simple API client for communicating with the backend server.
 * Handles authentication token management and API requests.
 * 
 * Features:
 * - Token-based authentication
 * - localStorage persistence
 * - Simple HTTP request wrapper
 * 
 * @author CyberOps
 * @version 1.0.0
 */

// ===== SIMPLE API CLIENT FOR BASIC AUTH =====

/**
 * APIClient class for handling all backend communication
 * Manages authentication tokens and provides simple request methods
 */
class APIClient {
    /**
     * Initialize the API client with base URL and token management
     */
    constructor() {
        // Point to our basic working server on port 9090
        // For production, change this to your deployed backend URL
        this.baseURL = 'http://127.0.0.1:9090/api';
        this.token = localStorage.getItem('authToken');
    }

    /**
     * Set authentication token and persist to localStorage
     * @param {string} token - JWT or session token
     */
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }

    /**
     * Get currently stored authentication token
     * @returns {string|null} Current auth token or null
     */
    getToken() {
        return this.token;
    }

    /**
     * Clear stored authentication token (logout)
     */
    clearToken() {
        this.token = null;
        localStorage.removeItem('authToken');
    }
}

// Create global API client instance
window.apiClient = new APIClient();