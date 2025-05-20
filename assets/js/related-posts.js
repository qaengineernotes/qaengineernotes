document.addEventListener('DOMContentLoaded', function () {
    const footerBlogs = document.getElementById('footer-blogs');
    const maxRelatedPosts = 3;

    async function loadRelatedPosts() {
        try {
            const response = await fetch('/assets/data/blogs.json');
            const data = await response.json();

            // Get random posts
            const randomPosts = getRandomPosts(data.blogs, maxRelatedPosts);

            // Render the posts
            renderRelatedPosts(randomPosts);
        } catch (error) {
            console.error('Error loading related posts:', error);
            showError();
        }
    }

    function getRandomPosts(posts, count) {
        const shuffled = [...posts].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function renderRelatedPosts(posts) {
        footerBlogs.innerHTML = posts.map(post => `
            <a href="${post.path}" class="footer-blog-card" role="article">
                <img src="${post.image}" alt="${post.title}" class="footer-blog-image" loading="lazy">
                <div class="footer-blog-content">
                    <h5 class="footer-blog-title">${post.title}</h5>
                    <div class="footer-blog-meta">
                        <span class="blog-category">${post.category}</span>
                        <span class="blog-read-time">${post.readTime}</span>
                    </div>
                </div>
            </a>
        `).join('');
    }

    function showError() {
        footerBlogs.innerHTML = `
            <div class="error-state text-center py-3">
                <i class="fas fa-exclamation-circle text-danger mb-2"></i>
                <p class="text-muted mb-0">Unable to load related posts</p>
            </div>
        `;
    }

    // Initialize
    loadRelatedPosts();
}); 