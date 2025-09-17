/**
 * Digital Garden Blog - Main Application JavaScript
 * 
 * This file contains the core frontend logic for the Digital Garden Blog application.
 * It handles user authentication, blog post display, theme management, and UI interactions.
 * 
 * Key Features:
 * - User authentication with localStorage persistence
 * - Dynamic blog post loading and display
 * - Dark/Light theme switching
 * - Responsive navigation menu
 * - Real-time notifications
 * 
 * Dependencies: None (Pure Vanilla JavaScript)
 * Compatible with: Modern browsers supporting ES6+
 * 
 * @author CyberOps
 * @version 1.0.0
 */

console.log('🚀 Digital Garden: JavaScript loading...');

// ===== GLOBAL STATE VARIABLES =====
let currentUser = null;        // Currently authenticated user object
let posts = [];               // Array of blog posts fetched from API
let currentTheme = 'light';   // Current theme (light/dark)

/**
 * Application initialization
 * Sets up event listeners and loads initial data when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded, initializing Digital Garden...');
    
    // Small delay to ensure everything is loaded properly
    setTimeout(() => {
        initializeApp();
    }, 100);
});

/**
 * Main application initialization function
 * Handles authentication check, event binding, and UI setup
 */
function initializeApp() {
    console.log('🔧 Initializing application...');
    
    try {
        // Check authentication
        const token = localStorage.getItem('authToken');
        console.log('🔑 Auth token found:', !!token);
        
        if (token) {
            verifyAuthToken(token);
        } else {
            console.log('👤 No token, loading as guest');
            updateAuthUI();
            loadPosts();
        }
        
        // Bind all events
        bindEvents();
        
        // Initialize UI
        initializeUI();
        
        console.log('✅ Digital Garden initialized successfully!');
        
        // Show welcome notification
        setTimeout(() => {
            showNotification('🌱 Welcome to Digital Garden! Everything is working perfectly.', 'success');
        }, 1000);
    } catch (error) {
        console.error('💥 Initialization error:', error);
        showNotification('Error initializing application', 'error');
    }
}

// Initialize UI elements
function initializeUI() {
    console.log('🎨 Initializing UI...');
    
    // Ensure home section is active
    showSection('home');
    
    // Test if elements exist
    const requiredElements = [
        'authSection',
        'userMenu', 
        'postsGrid',
        'loginBtn'
    ];
    
    requiredElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            console.log(`✅ Element found: ${id}`);
        } else {
            console.warn(`⚠️ Element missing: ${id}`);
        }
    });
}

// Verify authentication token
function verifyAuthToken(token) {
    console.log('🔍 Verifying auth token...');
    
    fetch('/api/auth/verify', {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('📡 Auth response status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('📡 Auth response data:', data);
        if (data.success && data.user) {
            currentUser = data.user;
            console.log('✅ User verified:', currentUser.username);
            updateAuthUI();
            loadPosts();
        } else {
            console.log('❌ Token invalid, removing...');
            localStorage.removeItem('authToken');
            updateAuthUI();
            loadPosts();
        }
    })
    .catch(error => {
        console.error('💥 Auth verification error:', error);
        localStorage.removeItem('authToken');
        updateAuthUI();
        loadPosts();
    });
}

// Load posts from API
function loadPosts() {
    console.log('📚 Loading posts...');
    
    fetch('http://127.0.0.1:9090/api/posts')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                posts = data.posts || [];
                renderPosts();
                console.log(`✅ Loaded ${posts.length} posts`);
            } else {
                console.error('Failed to load posts:', data.message);
                posts = [];
                renderPosts();
            }
        })
        .catch(error => {
            console.error('Error loading posts:', error);
            posts = [];
            renderPosts();
        });
}

// Update authentication UI
function updateAuthUI() {
    const authSection = document.getElementById('authSection');
    const userMenu = document.getElementById('userMenu');
    const usernameDisplay = document.getElementById('userName');
    
    if (currentUser) {
        if (authSection) authSection.classList.add('hidden');
        if (userMenu) userMenu.classList.remove('hidden');
        if (usernameDisplay) usernameDisplay.textContent = currentUser.username;
        console.log(`👤 Logged in as: ${currentUser.username}`);
    } else {
        if (authSection) authSection.classList.remove('hidden');
        if (userMenu) userMenu.classList.add('hidden');
        console.log('👤 Not logged in');
    }
}

// Render posts to the page
function renderPosts() {
    const postsContainer = document.getElementById('postsGrid');
    if (!postsContainer) return;
    
    if (posts.length === 0) {
        postsContainer.innerHTML = `
            <div class="empty-state">
                <h3>No posts yet</h3>
                <p>Start writing your first post!</p>
                ${currentUser ? '<button class="btn btn-primary" onclick="showSection(\'create\')">Create Your First Post</button>' : ''}
            </div>`;
        return;
    }
    
    postsContainer.innerHTML = posts.map(post => `
        <article class="post-card">
            <div class="post-header">
                <div class="post-meta">
                    <span class="post-category">${post.category || 'General'}</span>
                    <time class="post-date">${new Date(post.createdAt).toLocaleDateString()}</time>
                </div>
                ${currentUser ? `
                <div class="post-actions">
                    <button class="btn-icon" onclick="editPost('${post._id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="deletePost('${post._id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                ` : ''}
            </div>
            <h3 class="post-title">${post.title}</h3>
            <p class="post-excerpt">${post.content.substring(0, 150)}...</p>
            <div class="post-footer">
                <div class="post-tags">
                    ${(post.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <button class="btn btn-ghost" onclick="viewPost('${post._id}')">
                    Read More <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </article>
    `).join('');
}

// Show section function
function showSection(sectionId) {
    console.log(`📄 Showing section: ${sectionId}`);
    
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Special handling for posts section
    if (sectionId === 'posts') {
        loadPosts(); // Refresh posts when viewing posts section
    }
}

// Show modal function
function showModal(modalId) {
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('hidden');
        modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Close modal function
function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        modalOverlay.classList.add('hidden');
        modalOverlay.style.display = 'none';
    }
    document.body.style.overflow = 'auto';
}

// View post function
function viewPost(postId) {
    const post = posts.find(p => p._id === postId);
    if (!post) return;
    
    // You can implement a modal view or navigate to a detailed view
    console.log('Viewing post:', post);
    alert(`Title: ${post.title}\n\nContent: ${post.content}`);
}

// Edit post function
function editPost(postId) {
    const post = posts.find(p => p._id === postId);
    if (!post) return;
    
    // Fill the editor with post data
    const titleInput = document.getElementById('postTitle');
    const contentTextarea = document.getElementById('postContent');
    const categorySelect = document.getElementById('postCategory');
    const tagsInput = document.getElementById('postTags');
    
    if (titleInput) titleInput.value = post.title;
    if (contentTextarea) contentTextarea.value = post.content;
    if (categorySelect) categorySelect.value = post.category || 'general';
    if (tagsInput) tagsInput.value = (post.tags || []).join(', ');
    
    // Set editing mode
    window.editingPostId = postId;
    
    // Update form button text
    const submitBtn = document.querySelector('#createPostForm button[type="submit"]');
    if (submitBtn) submitBtn.textContent = 'Update Post';
    
    // Show create section
    showSection('create');
}

// Delete post function
async function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
        const response = await fetch(`/api/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Post deleted successfully!', 'success');
            loadPosts();
        } else {
            showNotification(data.message || 'Failed to delete post', 'error');
        }
    } catch (error) {
        console.error('Delete post error:', error);
        showNotification('Error deleting post', 'error');
    }
}

// Login function
async function login(username, password) {
    try {
        const response = await fetch('http://127.0.0.1:9090/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            localStorage.setItem('authToken', data.token);
            updateAuthUI();
            closeModal();
            showNotification('Login successful!', 'success');
            loadPosts(); // Reload posts to show admin actions
            return true;
        } else {
            showNotification(data.message || 'Login failed', 'error');
            return false;
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Login error. Please try again.', 'error');
        return false;
    }
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('authToken');
    updateAuthUI();
    showNotification('Logged out successfully', 'success');
    showSection('home');
    loadPosts(); // Reload posts to hide admin actions
}

// Create post function
async function createPost() {
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const category = document.getElementById('postCategory').value;
    const tagsText = document.getElementById('postTags').value;
    const tags = tagsText.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    if (!title || !content) {
        showNotification('Please fill in title and content', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ title, content, category, tags })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Post created successfully!', 'success');
            clearEditor();
            showSection('posts');
            loadPosts();
        } else {
            showNotification(data.message || 'Failed to create post', 'error');
        }
    } catch (error) {
        console.error('Create post error:', error);
        showNotification('Error creating post', 'error');
    }
}

// Update post function
async function updatePost(postId) {
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const category = document.getElementById('postCategory').value;
    const tagsText = document.getElementById('postTags').value;
    const tags = tagsText.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    if (!title || !content) {
        showNotification('Please fill in title and content', 'error');
        return;
    }
    
    try {
        const response = await fetch(`/api/posts/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ title, content, category, tags })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Post updated successfully!', 'success');
            clearEditor();
            showSection('posts');
            loadPosts();
        } else {
            showNotification(data.message || 'Failed to update post', 'error');
        }
    } catch (error) {
        console.error('Update post error:', error);
        showNotification('Error updating post', 'error');
    }
}

// Clear editor function
function clearEditor() {
    const titleInput = document.getElementById('postTitle');
    const contentTextarea = document.getElementById('postContent');
    const categorySelect = document.getElementById('postCategory');
    const tagsInput = document.getElementById('postTags');
    
    if (titleInput) titleInput.value = '';
    if (contentTextarea) contentTextarea.value = '';
    if (categorySelect) categorySelect.value = 'general';
    if (tagsInput) tagsInput.value = '';
    
    // Reset editing mode
    window.editingPostId = null;
    
    // Reset form button text
    const submitBtn = document.querySelector('#createPostForm button[type="submit"]');
    if (submitBtn) submitBtn.textContent = 'Publish Post';
}

// Show notification function - Enhanced
function showNotification(message, type = 'info') {
    console.log(`📢 Notification [${type.toUpperCase()}]: ${message}`);
    
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        min-width: 300px;
        max-width: 500px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        border-left: 4px solid ${type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : '#2563eb'};
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem;">
            <span style="color: ${type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : '#2563eb'}; font-weight: 500;">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'} ${message}
            </span>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #6b7280; margin-left: 1rem;">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Bind all events
function bindEvents() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            await login(username, password);
        });
    }
    
    // Create post form
    const createPostForm = document.getElementById('createPostForm');
    if (createPostForm) {
        createPostForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (window.editingPostId) {
                // Update existing post
                await updatePost(window.editingPostId);
            } else {
                // Create new post
                await createPost();
            }
        });
    }
    
    // Login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            showModal('loginModal');
        });
    }
    
    // Close modal on backdrop click
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            console.log('🎨 Theme toggle clicked');
            
            // Get current theme from html element
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            console.log('🎨 Current theme:', currentTheme, '→ New theme:', newTheme);
            
            // Apply new theme
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update icon
            const icon = themeToggle.querySelector('i');
            if (icon) {
                if (newTheme === 'dark') {
                    icon.className = 'fas fa-sun';
                } else {
                    icon.className = 'fas fa-moon';
                }
                console.log('🎨 Icon updated to:', icon.className);
            }
            
            showNotification(`Switched to ${newTheme} theme`, 'info');
        });
        
        // Load saved theme on startup
        const savedTheme = localStorage.getItem('theme') || 'light';
        console.log('🎨 Loading saved theme:', savedTheme);
        
        document.documentElement.setAttribute('data-theme', savedTheme);
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        console.log('✅ Theme toggle bound successfully');
    } else {
        console.warn('⚠️ Theme toggle button not found!');
    }
}

// Global functions for HTML onclick events
window.showSection = showSection;
window.showModal = showModal;
window.closeModal = closeModal;
window.viewPost = viewPost;
window.editPost = editPost;
window.deletePost = deletePost;
window.login = login;
window.logout = logout;
window.clearEditor = clearEditor;

// Toggle advanced editor features
window.toggleAdvancedEditor = function() {
    showNotification('Advanced editor features coming soon!', 'info');
};

// Test blog editor function
window.testBlogEditor = function() {
    if (currentUser) {
        showSection('create');
    } else {
        showModal('loginModal');
    }
    return false;
};

// Login modal functions
window.showLoginModal = function() {
    showModal('loginModal');
};

window.showRegisterModal = function() {
    showModal('registerModal');
};

console.log('✅ Digital Garden script loaded successfully');