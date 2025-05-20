document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.main-nav')) {
            navMenu.classList.remove('active');
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
        }
    });
});

// Back to Top Button
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Newsletter Form Handling
const newsletterForm = document.getElementById('newsletterForm');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        
        try {
            // Here you would typically send the data to your backend
            // For now, we'll just show a success message
            const modal = bootstrap.Modal.getInstance(document.getElementById('subscribeModal'));
            modal.hide();
            
            // Show success message
            const toast = new bootstrap.Toast(document.createElement('div'));
            toast._element.classList.add('toast', 'bg-success', 'text-white');
            toast._element.innerHTML = `
                <div class="toast-body">
                    Thank you for subscribing, ${name}! We'll keep you updated with the latest articles.
                </div>
            `;
            document.body.appendChild(toast._element);
            toast.show();
            
            // Clear form
            newsletterForm.reset();
            
            // Remove toast after it's hidden
            toast._element.addEventListener('hidden.bs.toast', () => {
                document.body.removeChild(toast._element);
            });
        } catch (error) {
            console.error('Error submitting newsletter form:', error);
            // Show error message
            alert('There was an error subscribing to the newsletter. Please try again later.');
        }
    });
}