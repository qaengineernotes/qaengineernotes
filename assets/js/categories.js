// Function to get category icon
function getCategoryIcon(category) {
    const iconMap = {
        'Testing': 'fa-clipboard-check',
        'AI': 'fa-robot',
        'AI & Automation': 'fa-robot',
        'AI & Gaming': 'fa-gamepad',
        'Career': 'fa-briefcase',
        'Development': 'fa-code',
        'Performance': 'fa-tachometer-alt',
        'API': 'fa-plug',
        'Security': 'fa-shield-alt'
    };
    return iconMap[category] || 'fa-folder';
}

// Function to get category description
function getCategoryDescription(category) {
    const descriptionMap = {
        'Testing': 'Learn about test case design, execution strategies, and best practices in testing.',
        'AI': 'Explore artificial intelligence and its impact on software testing and quality assurance.',
        'AI & Automation': 'Discover how AI is revolutionizing test automation and quality assurance.',
        'AI & Gaming': 'Learn about AI applications in game testing and quality assurance.',
        'Career': 'Tips and insights for advancing your career in software testing and QA.',
        'Development': 'Best practices and techniques for software development and testing.',
        'Performance': 'Discover techniques for load testing, stress testing, and performance optimization.',
        'API': 'Learn about API testing methodologies, tools, and best practices.',
        'Security': 'Explore security testing techniques, vulnerabilities, and prevention strategies.'
    };
    return descriptionMap[category] || 'Explore articles about ' + category;
}

// Function to populate category dropdown in blog page
async function populateCategoryDropdown() {
    try {
        const response = await fetch('assets/data/blogs.json');
        const data = await response.json();

        // Get unique categories
        const categories = [...new Set(data.blogs.map(blog => blog.category))];

        // Get the category filter select element
        const categoryFilter = document.getElementById('categoryFilter');
        if (!categoryFilter) return; // Exit if element doesn't exist

        // Add categories to the dropdown
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Function to populate category cards in categories page
async function populateCategoryCards() {
    try {
        const response = await fetch('assets/data/blogs.json');
        const data = await response.json();

        // Get unique categories with their blog counts
        const categoryCounts = data.blogs.reduce((acc, blog) => {
            acc[blog.category] = (acc[blog.category] || 0) + 1;
            return acc;
        }, {});

        // Get the categories grid
        const categoriesGrid = document.getElementById('categoriesGrid');
        if (!categoriesGrid) return; // Exit if element doesn't exist

        categoriesGrid.innerHTML = ''; // Clear loading state

        // Create category cards
        Object.entries(categoryCounts).forEach(([category, count]) => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4';

            col.innerHTML = `
                <div class="category-card h-100">
                    <div class="category-icon">
                        <i class="fas ${getCategoryIcon(category)}"></i>
                    </div>
                    <h3>${category}</h3>
                    <p>${getCategoryDescription(category)}</p>
                    <div class="category-meta">
                        <span class="article-count">${count} ${count === 1 ? 'Article' : 'Articles'}</span>
                    </div>
                    <a href="/blog.html?category=${encodeURIComponent(category)}" class="btn btn-outline-primary">View Articles</a>
                </div>
            `;

            categoriesGrid.appendChild(col);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
        const categoriesGrid = document.getElementById('categoriesGrid');
        if (categoriesGrid) {
            categoriesGrid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-exclamation-circle fa-3x text-danger mb-3"></i>
                    <h3>Error Loading Categories</h3>
                    <p class="text-muted">Please try refreshing the page.</p>
                </div>
            `;
        }
    }
}

// Initialize based on which page we're on
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the blog page
    if (document.getElementById('categoryFilter')) {
        populateCategoryDropdown();
    }

    // Check if we're on the categories page
    if (document.getElementById('categoriesGrid')) {
        populateCategoryCards();
    }
}); 