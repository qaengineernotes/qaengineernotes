document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('newsletterEmail');
    const submitButton = newsletterForm.querySelector('button[type="submit"]');
    const buttonText = submitButton.querySelector('.btn-text');
    const buttonLoader = submitButton.querySelector('.btn-loader');

    newsletterForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Reset previous validation
        emailInput.classList.remove('is-invalid');

        // Validate email
        if (!emailInput.value || !isValidEmail(emailInput.value)) {
            emailInput.classList.add('is-invalid');
            return;
        }

        // Show loading state
        buttonText.style.display = 'none';
        buttonLoader.style.display = 'inline-block';
        submitButton.disabled = true;

        try {
            // Simulate API call (replace with actual API endpoint)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            showNotification('Successfully subscribed to newsletter!', 'success');
            newsletterForm.reset();
        } catch (error) {
            showNotification('Failed to subscribe. Please try again.', 'error');
        } finally {
            // Reset button state
            buttonText.style.display = 'inline-block';
            buttonLoader.style.display = 'none';
            submitButton.disabled = false;
        }
    });

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}); 