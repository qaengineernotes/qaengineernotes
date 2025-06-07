document.addEventListener('DOMContentLoaded', function () {
    const itemsPerPage = 6;
    let currentPage = 1;
    let blogs = [];
    let filteredBlogs = [];
    let searchTerm = '';
    let selectedCategory = '';

    // DOM Elements
    const blogGrid = document.getElementById('blog-grid');
    const searchInput = document.getElementById('blogSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const noResults = document.getElementById('noResults');

    // Fetch blogs data
    async function fetchBlogs() {
        try {
            const response = await fetch('/assets/data/blogs.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Sort blogs by date in descending order (newest first)
            blogs = data.blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
            filteredBlogs = [...blogs];
            renderBlogs();
            renderPagination();
        } catch (error) {
            console.error('Error fetching blogs:', error);
            showError();
        }
    }

    // Filter blogs based on search term and category
    function filterBlogs() {
        filteredBlogs = blogs.filter(blog => {
            const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                blog.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = !selectedCategory || blog.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
        currentPage = 1;
        renderBlogs();
        renderPagination();
        updateNoResults();
    }

    // Update no results message visibility
    function updateNoResults() {
        if (filteredBlogs.length === 0) {
            noResults.style.display = 'block';
            blogGrid.style.display = 'none';
        } else {
            noResults.style.display = 'none';
            blogGrid.style.display = 'grid';
        }
    }

    // Render blog cards
    function renderBlogs() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentBlogs = filteredBlogs.slice(startIndex, endIndex);

        blogGrid.innerHTML = currentBlogs.map(blog => `
            <article class="blog-card" role="article">
                <div class="blog-card-image">
                    <img src="${blog.image}" alt="${blog.title}" loading="lazy">
                </div>
                <div class="blog-card-content">
                    <div class="blog-card-meta">
                        <span class="blog-category">${blog.category}</span>
                        <span class="blog-read-time">${blog.readTime}</span>
                    </div>
                    <h2 class="blog-card-title">
                        <a href="${blog.path.endsWith('.html') ? blog.path : blog.path + '.html'}">${blog.title}</a>
                    </h2>
                    <p class="blog-card-description">${blog.description}</p>
                    <div class="blog-card-footer">
                        <span class="blog-date">${formatDate(blog.date)}</span>
                        <span class="blog-author">${blog.author}</span>
                    </div>
                </div>
            </article>
        `).join('');
    }

    // Render pagination
    function renderPagination() {
        const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
        const pagination = document.getElementById('pagination');

        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }

        pagination.style.display = 'flex';
        let paginationHTML = '';

        // Previous button
        paginationHTML += `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
        `;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <li class="page-item ${currentPage === i ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }

        // Next button
        paginationHTML += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        `;

        pagination.innerHTML = paginationHTML;

        // Add click event listeners to pagination links
        pagination.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const newPage = parseInt(this.dataset.page);
                if (newPage && newPage !== currentPage && newPage > 0 && newPage <= totalPages) {
                    currentPage = newPage;
                    renderBlogs();
                    renderPagination();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    }

    // Format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Show error state
    function showError() {
        blogGrid.innerHTML = `
            <div class="error-state text-center py-5">
                <i class="fas fa-exclamation-circle fa-3x text-danger mb-3"></i>
                <p>Sorry, we couldn't load the articles. Please try again later.</p>
            </div>
        `;
    }

    // Event Listeners
    searchInput.addEventListener('input', function () {
        searchTerm = this.value.trim();
        filterBlogs();
    });

    categoryFilter.addEventListener('change', function () {
        selectedCategory = this.value;
        filterBlogs();
    });

    // Initialize
    fetchBlogs();
}); 