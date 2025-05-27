// Function to create a blog card
function createBlogCard(post) {
    return `
        <div class="col">
            <article class="card h-100 shadow-sm">
                <img src="${post.image}" alt="${post.title}" class="card-img-top">
                <div class="card-body">
                    <span class="badge bg-primary mb-2">${post.category}</span>
                    <h3 class="card-title h5 mb-3">
                        <a href="/${post.path}" class="text-decoration-none text-dark">${post.title}</a>
                    </h3>
                    <p class="card-text text-muted">${post.description}</p>
                </div>
                <div class="card-footer bg-transparent border-top-0">
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">
                            <i class="far fa-calendar-alt me-1"></i>
                            ${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </small>
                        <a href="/${post.path}" class="btn btn-sm btn-outline-primary">Read More</a>
                    </div>
                </div>
            </article>
        </div>
    `;
}

// Function to render recent posts
async function renderRecentPosts() {
    const recentPostsGrid = document.getElementById('recent-posts-grid');
    if (!recentPostsGrid) return;

    try {
        // Fetch the blog data
        const response = await fetch('/assets/data/blogs.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Sort posts by date in descending order (latest first)
        const sortedPosts = data.blogs.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Get the first 20 posts
        const postsToShow = sortedPosts.slice(0, 20);

        // Create and append blog cards
        const blogCards = postsToShow.map(post => createBlogCard(post)).join('');
        recentPostsGrid.innerHTML = blogCards;
    } catch (error) {
        console.error('Error loading blog posts:', error);
        recentPostsGrid.innerHTML = '<p class="error-message">Unable to load blog posts. Please try again later.</p>';
    }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', renderRecentPosts); 