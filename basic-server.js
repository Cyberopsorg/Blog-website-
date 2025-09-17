/**
 * Digital Garden Blog - Basic Authentication Server
 * 
 * A lightweight Node.js HTTP server that provides:
 * - User authentication endpoint
 * - Blog posts API endpoint
 * - CORS support for frontend integration
 * 
 * This server is designed for local development and testing.
 * For production, consider using a proper framework like Express.js
 * with a real database system.
 * 
 * @author CyberOps
 * @version 1.0.0
 */

const http = require('http');

// Server configuration
const PORT = 9090;
const HOST = '127.0.0.1';

console.log('🧪 Creating basic HTTP server...');

/**
 * Main server request handler
 * Handles all incoming HTTP requests and routes them appropriately
 */
const server = http.createServer((req, res) => {
    console.log(`📡 Request received: ${req.method} ${req.url}`);
    
    // Set CORS headers to allow frontend communication
    // In production, replace '*' with your specific domain
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    if (req.method === 'POST' && req.url === '/api/auth/login') {
        console.log('🔐 Login endpoint hit!');
        
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            console.log('📦 Request body:', body);
            
            try {
                const data = JSON.parse(body);
                console.log('👤 Login attempt:', data.username);
                
                if (data.username === 'admin' && data.password === 'admin123') {
                    console.log('✅ LOGIN SUCCESS!');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        message: 'Login successful!',
                        token: 'fake-jwt-token-12345',
                        user: {
                            id: '1',
                            username: 'admin',
                            email: 'admin@blog.com',
                            role: 'admin'
                        }
                    }));
                } else {
                    console.log('❌ Invalid credentials');
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        message: 'Invalid credentials'
                    }));
                }
            } catch (error) {
                console.log('💥 JSON parse error:', error.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    message: 'Invalid JSON'
                }));
            }
        });
    } else if (req.method === 'GET' && req.url === '/api/posts') {
        console.log('📰 Posts endpoint hit!');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            posts: [
                {
                    id: 1,
                    title: "Welcome to Digital Garden",
                    content: "This is your first post! Start writing amazing content.",
                    excerpt: "Welcome to your new digital garden where ideas bloom.",
                    author: "Admin",
                    date: new Date().toISOString(),
                    tags: ["welcome", "first-post"],
                    published: true
                },
                {
                    id: 2,
                    title: "Getting Started with Blogging",
                    content: "Here are some tips to get started with your blog...",
                    excerpt: "Essential tips for new bloggers to create engaging content.",
                    author: "Admin", 
                    date: new Date(Date.now() - 86400000).toISOString(),
                    tags: ["blogging", "tips"],
                    published: true
                }
            ]
        }));
    } else {
        // Default response for undefined endpoints
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            message: 'Digital Garden Blog API Server',
            version: '1.0.0',
            endpoints: {
                'POST /api/auth/login': 'User authentication',
                'GET /api/posts': 'Fetch blog posts'
            },
            status: 'running'
        }));
    }
});

/**
 * Start the server and listen for incoming connections
 */
server.listen(PORT, HOST, () => {
    console.log(`\n🚀 DIGITAL GARDEN BLOG SERVER RUNNING!`);
    console.log(`📍 URL: http://${HOST}:${PORT}`);
    console.log(`🔐 Auth Endpoint: POST http://${HOST}:${PORT}/api/auth/login`);
    console.log(`📰 Posts Endpoint: GET http://${HOST}:${PORT}/api/posts`);
    console.log(`\n👤 Test credentials: admin / admin123`);
    console.log(`\n🌍 Frontend: Open public/index.html with Live Server`);
});

/**
 * Handle server errors gracefully
 */
server.on('error', (error) => {
    console.error('❌ Server error:', error);
    if (error.code === 'EADDRINUSE') {
        console.error(`💥 Port ${PORT} is already in use. Please stop other servers or change the port.`);
    }
});