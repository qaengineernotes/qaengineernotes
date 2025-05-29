// Search functionality
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchModal = document.getElementById('searchModal');
    let searchTimeout;

    // Function to highlight text
    function highlightText(text, searchTerm) {
        if (!searchTerm) return text;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // Function to get text content from HTML
    function getTextContent(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        // Remove script and style elements
        const scripts = temp.getElementsByTagName('script');
        const styles = temp.getElementsByTagName('style');
        while (scripts.length > 0) scripts[0].remove();
        while (styles.length > 0) styles[0].remove();
        return temp.textContent || temp.innerText || '';
    }

    // Function to clean and format excerpt
    function formatExcerpt(text, searchTerm) {
        // Remove any JSON-like content
        text = text.replace(/\{.*?\}/g, '');
        // Remove any URLs
        text = text.replace(/https?:\/\/[^\s]+/g, '');
        // Remove any special characters and extra spaces
        text = text.replace(/[^\w\s.,!?-]/g, ' ').replace(/\s+/g, ' ').trim();

        // Find the search term and get surrounding context
        const searchIndex = text.toLowerCase().indexOf(searchTerm.toLowerCase());
        if (searchIndex === -1) return text;

        const start = Math.max(0, searchIndex - 100);
        const end = Math.min(text.length, searchIndex + searchTerm.length + 100);
        let excerpt = text.substring(start, end);

        // Add ellipsis if we're not at the start/end of the text
        if (start > 0) excerpt = '...' + excerpt;
        if (end < text.length) excerpt = excerpt + '...';

        return excerpt;
    }

    // Function to create search result item
    function createSearchResultItem(title, url, excerpt, searchTerm) {
        const div = document.createElement('div');
        div.className = 'search-result-item p-3 border-bottom';
        div.innerHTML = `
            <h5 class="mb-2">
                <a href="${url}" class="text-decoration-none text-dark">${highlightText(title, searchTerm)}</a>
            </h5>
            <p class="small mb-2">${url}</p>
            <p class="mb-0">${highlightText(excerpt, searchTerm)}</p>
        `;
        return div;
    }

    // Function to perform search
    async function performSearch(searchTerm) {
        if (!searchTerm || searchTerm.length < 2) {
            searchResults.innerHTML = '<div class="text-center">Enter at least 2 characters to search</div>';
            return;
        }

        // Show loading state
        searchResults.innerHTML = `
            <div class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Searching...</span>
                </div>
                <p class="mt-2">Searching articles...</p>
            </div>
        `;

        try {
            const response = await fetch('/assets/data/blogs.json');
            if (!response.ok) {
                throw new Error(`Failed to fetch blogs.json: ${response.status}`);
            }
            const data = await response.json();
            const results = new Map(); // Use Map to store unique results per file
            let fetchErrors = 0;

            // Search through blog content
            for (const blog of data.blogs) {
                try {
                    // Ensure the path starts with a forward slash and is relative to the root
                    const blogPath = blog.path.startsWith('/') ? blog.path : '/' + blog.path;
                    const response = await fetch(blogPath);

                    if (!response.ok) {
                        console.warn(`Failed to fetch ${blogPath}: ${response.status}`);
                        fetchErrors++;
                        continue;
                    }

                    const html = await response.text();
                    const content = getTextContent(html);

                    // Search in both title and content
                    if (content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        blog.description.toLowerCase().includes(searchTerm.toLowerCase())) {

                        // Only add one result per file
                        if (!results.has(blogPath)) {
                            const title = blog.title;
                            const url = blogPath;
                            const excerpt = formatExcerpt(content, searchTerm);

                            results.set(blogPath, {
                                title,
                                url,
                                excerpt
                            });
                        }
                    }
                } catch (error) {
                    console.warn(`Error fetching ${blog.path}:`, error);
                    fetchErrors++;
                    continue;
                }
            }

            // Display results
            if (results.size > 0) {
                searchResults.innerHTML = '';
                results.forEach((result, path) => {
                    searchResults.appendChild(createSearchResultItem(
                        result.title,
                        result.url,
                        result.excerpt,
                        searchTerm
                    ));
                });
            } else {
                let errorMessage = '';
                if (fetchErrors > 0) {
                    errorMessage = `<p class="text-muted">Some articles could not be searched. Please try again later.</p>`;
                }

                searchResults.innerHTML = `
                    <div class="text-center">
                        <i class="fas fa-search fa-3x text-muted mb-3"></i>
                        <h3>No Results Found</h3>
                        <p class="text-muted">Try different keywords or browse our categories.</p>
                        ${errorMessage}
                    </div>
                `;
            }
        } catch (error) {
            console.error('Search error:', error);
            searchResults.innerHTML = `
                <div class="text-center text-danger">
                    <i class="fas fa-exclamation-circle fa-3x mb-3"></i>
                    <h3>Error Performing Search</h3>
                    <p>Please try again later.</p>
                </div>
            `;
        }
    }

    // Event listener for search input
    searchInput.addEventListener('input', function (e) {
        clearTimeout(searchTimeout);
        const searchTerm = e.target.value.trim();

        searchTimeout = setTimeout(() => {
            performSearch(searchTerm);
        }, 300);
    });

    // Clear results when modal is closed
    searchModal.addEventListener('hidden.bs.modal', function () {
        searchInput.value = '';
        searchResults.innerHTML = '';
    });
});