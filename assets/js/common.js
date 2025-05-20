// Common functionality for all pages
document.addEventListener('DOMContentLoaded', function () {
    // Initialize search functionality
    initializeSearch();

    // Initialize back to top button
    initializeBackToTop();

    // Initialize scroll progress
    initializeScrollProgress();

    // Initialize mobile menu
    initializeMobileMenu();

    // Initialize footer blogs
    initializeFooterBlogs();
});

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchLoading = document.getElementById('searchLoading');
    const searchNoResults = document.getElementById('searchNoResults');

    if (!searchInput) return;

    let searchTimeout;

    searchInput.addEventListener('input', function () {
        clearTimeout(searchTimeout);
        const query = this.value.trim();

        if (query.length < 2) {
            searchResults.innerHTML = '';
            return;
        }

        searchTimeout = setTimeout(async () => {
            searchLoading.style.display = 'block';
            searchResults.innerHTML = '';

            try {
                const response = await fetch('/assets/data/blogs.json');
                const data = await response.json();

                const results = data.blogs.filter(blog =>
                    blog.title.toLowerCase().includes(query.toLowerCase()) ||
                    blog.description.toLowerCase().includes(query.toLowerCase())
                );

                if (results.length === 0) {
                    searchNoResults.style.display = 'block';
                } else {
                    searchNoResults.style.display = 'none';
                    const resultsHTML = results.map(blog => createSearchResult(blog)).join('');
                    searchResults.innerHTML = resultsHTML;
                }
            } catch (error) {
                console.error('Search error:', error);
                searchResults.innerHTML = '<p class="error-message">Error performing search. Please try again.</p>';
            } finally {
                searchLoading.style.display = 'none';
            }
        }, 300);
    });
}

// Back to top button
function initializeBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Scroll progress
function initializeScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Mobile menu
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!menuToggle || !navLinks) return;

    // Toggle menu on button click
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('show');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.nav-links') && !event.target.closest('.mobile-menu-toggle')) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('show');
        }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('show');
        });
    });
}

// Footer blogs
async function initializeFooterBlogs() {
    const footerBlogs = document.getElementById('footer-blogs');
    if (!footerBlogs) return;

    try {
        const response = await fetch('/assets/data/blogs.json');
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

// Utility functions
function createSearchResult(blog) {
    return `
        <div class="search-result">
            <a href="/${blog.path}" class="search-result-link">
                <h4 class="search-result-title">${blog.title}</h4>
                <p class="search-result-description">${blog.description}</p>
            </a>
        </div>
    `;
}

