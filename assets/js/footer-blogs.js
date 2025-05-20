// Function to get random posts
function getRandomPosts(posts, count) {
    const shuffled = [...posts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Function to create a footer blog card
function createFooterBlogCard(post) {
    return `
        <a href="/${post.path}" class="footer-blog-card">
            <img src="${post.image}" alt="${post.title}" class="footer-blog-image">
            <div class="footer-blog-content">
                <h5 class="footer-blog-title">${post.title}</h5>
                <div class="footer-blog-meta">
                    <span>${post.author}</span>
                    <span>•</span>
                    <span>${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>
        </a>
    `;
}

// Function to render footer blogs
async function renderFooterBlogs() {
    const footerBlogs = document.getElementById('footer-blogs');
    if (!footerBlogs) return;

    try {
        // Fetch the blog data
        const response = await fetch('/assets/data/blogs.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Get 3 random posts
        const randomPosts = getRandomPosts(data.blogs, 3);
        
        // Create and append footer blog cards
        const blogCards = randomPosts.map(post => createFooterBlogCard(post)).join('');
        footerBlogs.innerHTML = blogCards;
    } catch (error) {
        console.error('Error loading random blog posts:', error);
        footerBlogs.innerHTML = '<p class="error-message">Unable to load related posts.</p>';
    }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', renderFooterBlogs); 