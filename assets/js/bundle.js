// Utility Functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Cache for blog data
let blogDataCache = null;

// Fetch blog data with caching
async function fetchBlogData() {
    if (blogDataCache) return blogDataCache;
    
    try {
        const response = await fetch('/assets/data/blogs.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        blogDataCache = await response.json();
        return blogDataCache;
    } catch (error) {
        console.error('Error fetching blog data:', error);
        return null;
    }
}

// Footer Blogs
async function renderFooterBlogs() {
    const footerBlogs = document.getElementById('footer-blogs');
    if (!footerBlogs) return;

    try {
        const data = await fetchBlogData();
        if (!data) throw new Error('No blog data available');
        
        const randomPosts = getRandomPosts(data.blogs, 3);
        const blogCards = randomPosts.map(post => createFooterBlogCard(post)).join('');
        footerBlogs.innerHTML = blogCards;
    } catch (error) {
        console.error('Error loading random blog posts:', error);
        footerBlogs.innerHTML = '<p class="error-message">Unable to load related posts.</p>';
    }
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchModal = document.getElementById('searchModal');
    
    if (!searchInput || !searchResults) return;

    const performSearch = debounce(async (searchTerm) => {
        if (!searchTerm || searchTerm.length < 2) {
            searchResults.innerHTML = '<div class="text-center">Enter at least 2 characters to search</div>';
            return;
        }

        try {
            const data = await fetchBlogData();
            if (!data) throw new Error('No blog data available');

            const results = new Map();
            for (const blog of data.blogs) {
                if (blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) {
                    results.set(blog.path, {
                        title: blog.title,
                        url: blog.path,
                        excerpt: blog.excerpt
                    });
                }
            }

            if (results.size > 0) {
                searchResults.innerHTML = '';
                results.forEach((result) => {
                    searchResults.appendChild(createSearchResultItem(
                        result.title,
                        result.url,
                        result.excerpt,
                        searchTerm
                    ));
                });
            } else {
                searchResults.innerHTML = '<div class="text-center">No results found</div>';
            }
        } catch (error) {
            console.error('Search error:', error);
            searchResults.innerHTML = '<div class="text-center text-danger">Error performing search</div>';
        }
    }, 300);

    searchInput.addEventListener('input', (e) => performSearch(e.target.value.trim()));
    
    if (searchModal) {
        searchModal.addEventListener('hidden.bs.modal', () => {
            searchInput.value = '';
            searchResults.innerHTML = '';
        });
    }
}

// Back to Top Button
function initializeBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    window.addEventListener('scroll', debounce(() => {
        if (window.pageYOffset > 100) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }, 100));

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Scroll Progress
function initializeScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (!progressBar) return;

    window.addEventListener('scroll', debounce(() => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    }, 100));
}

// Mobile Menu
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

// Newsletter Form
function initializeNewsletter() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        try {
            // Add your newsletter subscription logic here
            console.log('Subscribing email:', email);
            newsletterForm.reset();
            alert('Thank you for subscribing!');
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            alert('Error subscribing to newsletter. Please try again.');
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    renderFooterBlogs();
    initializeSearch();
    initializeBackToTop();
    initializeScrollProgress();
    initializeMobileMenu();
    initializeNewsletter();
}); 