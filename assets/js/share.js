// Share functionality
document.addEventListener('DOMContentLoaded', function () {
    // Function to get the current page's title and description
    function getPageMetadata() {
        const title = document.querySelector('meta[property="og:title"]')?.content || document.title;
        const description = document.querySelector('meta[property="og:description"]')?.content ||
            document.querySelector('meta[name="description"]')?.content || '';
        return { title, description };
    }

    // Function to share on Twitter
    window.shareOnTwitter = function () {
        const { title } = getPageMetadata();
        // Keep it short and engaging for Twitter's character limit
        const text = encodeURIComponent(`Check out: ${title}`);
        const url = encodeURIComponent(window.location.href);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400');
    };

    // Function to share on LinkedIn
    window.shareOnLinkedIn = function () {
        const { title, description } = getPageMetadata();
        const url = encodeURIComponent(window.location.href);
        // Using LinkedIn's sharing URL format with proper parameters
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        window.open(linkedInUrl, '_blank', 'width=600,height=400');
    };

    // Function to share on Facebook
    window.shareOnFacebook = function () {
        const url = encodeURIComponent(window.location.href);
        // Using Facebook's sharing URL format with proper parameters
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
    };

    // Function to copy link
    window.copyLink = function () {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            // Create and show a toast notification
            const toast = document.createElement('div');
            toast.className = 'toast-notification';
            toast.textContent = 'Link copied to clipboard!';
            document.body.appendChild(toast);

            // Remove the toast after 3 seconds
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }).catch(() => {
            alert('Failed to copy link. Please try again.');
        });
    };
}); 