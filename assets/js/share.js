document.addEventListener('DOMContentLoaded', function() {
    const shareButtons = document.querySelectorAll('.share-button');
    
    shareButtons.forEach(button => {
        const menu = document.createElement('div');
        menu.className = 'share-menu';
        menu.innerHTML = `
            <a href="#" data-platform="twitter">
                <i class="fab fa-twitter"></i>
                <span>Twitter</span>
            </a>
            <a href="#" data-platform="facebook">
                <i class="fab fa-facebook"></i>
                <span>Facebook</span>
            </a>
            <a href="#" data-platform="linkedin">
                <i class="fab fa-linkedin"></i>
                <span>LinkedIn</span>
            </a>
            <a href="#" data-platform="copy">
                <i class="fas fa-link"></i>
                <span>Copy Link</span>
            </a>
        `;
        
        button.appendChild(menu);
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            menu.classList.toggle('active');
        });
        
        menu.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = e.target.closest('a')?.dataset.platform;
            if (!platform) return;
            
            const url = window.location.href;
            const title = document.title;
            
            switch (platform) {
                case 'twitter':
                    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
                    break;
                case 'facebook':
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                    break;
                case 'linkedin':
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
                    break;
                case 'copy':
                    navigator.clipboard.writeText(url).then(() => {
                        showNotification('Link copied to clipboard!', 'success');
                    }).catch(() => {
                        showNotification('Failed to copy link', 'error');
                    });
                    break;
            }
            
            menu.classList.remove('active');
        });
    });
    
    // Close share menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.share-button')) {
            document.querySelectorAll('.share-menu').forEach(menu => {
                menu.classList.remove('active');
            });
        }
    });
}); 