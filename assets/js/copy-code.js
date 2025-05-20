document.addEventListener('DOMContentLoaded', function() {
    const codeBlocks = document.querySelectorAll('.code-block');
    
    codeBlocks.forEach(block => {
        const copyButton = block.querySelector('.copy-code');
        const code = block.querySelector('code');
        
        copyButton.addEventListener('click', async function() {
            try {
                await navigator.clipboard.writeText(code.textContent);
                
                // Visual feedback
                const originalIcon = copyButton.innerHTML;
                copyButton.innerHTML = '<i class="fas fa-check"></i>';
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    copyButton.innerHTML = originalIcon;
                }, 2000);
                
                showNotification('Code copied to clipboard!', 'success');
            } catch (err) {
                showNotification('Failed to copy code', 'error');
            }
        });
    });
}); 