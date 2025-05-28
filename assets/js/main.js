// Main JavaScript file combining all functionality
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all features

    initializeBackToTop();
    initializeScrollProgress();
    initializeMobileMenu();
    initializeFooterBlogs();
});

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
    const scrollProgress = document.querySelector('.scroll-progress');
    const scrollProgressBar = document.querySelector('.scroll-progress-bar');
    const readingProgressBar = document.querySelector('.reading-progress-bar');

    if (scrollProgressBar) {
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            scrollProgressBar.style.width = scrolled + '%';
            if (scrollProgress) {
                scrollProgress.setAttribute('aria-valuenow', Math.round(scrolled));
            }
        });
    }

    if (readingProgressBar) {
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            readingProgressBar.style.width = scrolled + '%';
        });
    }
}

// Mobile menu
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('show');
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.nav-links') && !event.target.closest('.mobile-menu-toggle')) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('show');
        }
    });

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

        const randomPosts = getRandomPosts(data.blogs, 3);
        const blogCards = randomPosts.map(post => createFooterBlogCard(post)).join('');
        footerBlogs.innerHTML = blogCards;
    } catch (error) {
        console.error('Error loading random blog posts:', error);
        footerBlogs.innerHTML = '<p class="error-message">Unable to load related posts.</p>';
    }
}

// Utility functions
function getRandomPosts(posts, count) {
    const shuffled = [...posts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

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

// Social Share Functions
function shareOnTwitter() {
    const text = encodeURIComponent('Check out this article!');
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
}

function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!');
    });
}

// Smooth Scroll for Table of Contents
document.querySelectorAll('.blog-toc a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        targetElement.scrollIntoView({
            behavior: 'smooth'
        });
    });
}); 