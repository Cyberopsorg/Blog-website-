/**
 * Demo Mode for Static Deployment
 * 
 * Provides mock authentication and data for static hosting environments
 * like Netlify, GitHub Pages, etc. where no backend is available.
 * 
 * @author CyberOps
 * @version 1.0.0
 */

// ===== DEMO MODE CONFIGURATION =====

const DEMO_MODE = {
    enabled: true,
    mockUser: {
        id: 1,
        username: 'admin',
        email: 'admin@digitalgarden.com',
        name: 'Demo Admin'
    },
    mockPosts: [
        {
            id: 1,
            title: "Welcome to Digital Garden 🌱",
            content: "This is a demo post showing how the blog looks with content. In a full deployment, this would be connected to a MongoDB database with real user authentication.",
            author: "Demo Admin",
            date: "2025-09-18",
            tags: ["welcome", "demo"],
            excerpt: "Welcome to our beautiful digital garden blog..."
        },
        {
            id: 2,
            title: "Features of This Blog 📝",
            content: "This blog includes:\n\n• Beautiful responsive design\n• Dark/Light theme toggle\n• User authentication (demo mode)\n• MongoDB integration (when backend is running)\n• Modern UI with animations\n• Mobile-friendly layout",
            author: "Demo Admin", 
            date: "2025-09-17",
            tags: ["features", "design"],
            excerpt: "Explore all the amazing features built into this blog..."
        },
        {
            id: 3,
            title: "How to Deploy with Backend 🚀",
            content: "To get full functionality:\n\n1. Deploy the Node.js backend to a service like Heroku, Railway, or Vercel\n2. Set up MongoDB Atlas database\n3. Update the API_BASE_URL in config.js\n4. Deploy frontend to Netlify/Vercel\n\nFor now, enjoy this static demo!",
            author: "Demo Admin",
            date: "2025-09-16", 
            tags: ["deployment", "guide"],
            excerpt: "Learn how to deploy the full-stack version..."
        }
    ]
};

// ===== DEMO API FUNCTIONS =====

class DemoAPI {
    constructor() {
        this.isLoggedIn = localStorage.getItem('demo_logged_in') === 'true';
        this.posts = JSON.parse(localStorage.getItem('demo_posts')) || DEMO_MODE.mockPosts;
        this.savePostsToStorage();
    }

    savePostsToStorage() {
        localStorage.setItem('demo_posts', JSON.stringify(this.posts));
    }

    // Mock authentication
    async login(username, password) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (username === 'admin' && password === 'admin123') {
                    this.isLoggedIn = true;
                    localStorage.setItem('demo_logged_in', 'true');
                    localStorage.setItem('demo_user', JSON.stringify(DEMO_MODE.mockUser));
                    resolve({
                        success: true,
                        token: 'demo_token_' + Date.now(),
                        user: DEMO_MODE.mockUser
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Invalid credentials. Try admin/admin123'
                    });
                }
            }, 500); // Simulate network delay
        });
    }

    async logout() {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.isLoggedIn = false;
                localStorage.removeItem('demo_logged_in');
                localStorage.removeItem('demo_user');
                resolve({ success: true });
            }, 300);
        });
    }

    async getPosts() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    posts: this.posts
                });
            }, 300);
        });
    }

    async createPost(title, content, tags = []) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (!this.isLoggedIn) {
                    resolve({ success: false, message: 'Not authenticated' });
                    return;
                }

                const newPost = {
                    id: Date.now(),
                    title,
                    content,
                    author: DEMO_MODE.mockUser.name,
                    date: new Date().toISOString().split('T')[0],
                    tags,
                    excerpt: content.substring(0, 100) + '...'
                };

                this.posts.unshift(newPost);
                this.savePostsToStorage();
                
                resolve({
                    success: true,
                    post: newPost,
                    message: 'Post created successfully (demo mode)'
                });
            }, 500);
        });
    }

    async deletePost(postId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (!this.isLoggedIn) {
                    resolve({ success: false, message: 'Not authenticated' });
                    return;
                }

                this.posts = this.posts.filter(post => post.id !== postId);
                this.savePostsToStorage();
                
                resolve({
                    success: true,
                    message: 'Post deleted successfully (demo mode)'
                });
            }, 400);
        });
    }

    getCurrentUser() {
        if (this.isLoggedIn) {
            return JSON.parse(localStorage.getItem('demo_user'));
        }
        return null;
    }

    isAuthenticated() {
        return this.isLoggedIn;
    }
}

// ===== ENVIRONMENT DETECTION =====

function isStaticDeployment() {
    // Check if we're on a static hosting platform (not localhost)
    const hostname = window.location.hostname;
    const isLocal = hostname.includes('localhost') || hostname.includes('127.0.0.1') || hostname === '';
    
    // If not local, assume it's static hosting
    return !isLocal;
}

// ===== INITIALIZE DEMO MODE =====

// Create global demo API instance if on static hosting
if (isStaticDeployment()) {
    window.demoAPI = new DemoAPI();
    
    // Show demo mode notification
    console.log('🎭 Demo Mode Active');
    console.log('📝 Login with: admin / admin123');
    console.log('🌐 For full functionality, deploy with backend server');
    
    // Add demo mode indicator to page
    function addDemoIndicator() {
        const indicator = document.createElement('div');
        indicator.innerHTML = `
            <div style="
                position: fixed; 
                top: 0; 
                left: 0; 
                right: 0; 
                background: linear-gradient(45deg, #ff6b6b, #ffa500); 
                color: white; 
                text-align: center; 
                padding: 8px; 
                font-size: 12px; 
                z-index: 9999;
                font-weight: 500;
            ">
                🎭 Demo Mode • Login: admin/admin123 • Full features need backend deployment
            </div>
        `;
        document.body.appendChild(indicator);
        
        // Adjust body padding to account for indicator
        document.body.style.paddingTop = '35px';
    }
    
    // Add indicator when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addDemoIndicator);
    } else {
        addDemoIndicator();
    }
}

// Export for use in other files
window.DEMO_MODE = DEMO_MODE;
window.DemoAPI = DemoAPI;
window.isStaticDeployment = isStaticDeployment;