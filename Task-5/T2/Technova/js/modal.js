// js/modal.js - Modal Popup
document.addEventListener('DOMContentLoaded', function() {
    initModal();
});

function initModal() {
    const modal = document.getElementById('welcomeModal');
    const closeBtn = document.getElementById('modalClose');
    const overlay = document.getElementById('modalOverlay');
    
    if (!modal) return;
    
    // Check if modal was shown before
    const modalShown = sessionStorage.getItem('modalShown');
    if (!modalShown) {
        setTimeout(() => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 1500);
    }
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        sessionStorage.setItem('modalShown', 'true');
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}