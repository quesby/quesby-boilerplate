/**
 * Mobile Menu Toggle
 * Handles opening/closing of mobile menu
 */

document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const mainNavigation = document.getElementById('main-navigation');
    
    if (navToggle && mainNavigation) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            mainNavigation.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !mainNavigation.contains(e.target)) {
                mainNavigation.classList.remove('active');
            }
        });
        
        // Close menu with ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                mainNavigation.classList.remove('active');
            }
        });
    }
});
