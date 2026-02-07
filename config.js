const CONFIG = {
    // API_BASE_URL: "http://localhost:5000/api", // Local Backend
    API_BASE_URL: "https://cruxh-check-100.onrender.com/api",
    
    // Helper to determine current environment (optional enhancement)
    getApiUrl: function() {
        // Force production API for all environments as requested
        return this.API_BASE_URL;
    }
};

// Freeze to prevent accidental modification
Object.freeze(CONFIG);
