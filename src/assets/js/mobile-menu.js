/**
 * Mobile Menu Toggle
 * Gestisce l'apertura/chiusura del menu mobile
 */

document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const mainNavigation = document.getElementById('main-navigation');
    
    if (navToggle && mainNavigation) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            mainNavigation.classList.toggle('active');
        });
        
        // Chiudi menu quando si clicca fuori
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !mainNavigation.contains(e.target)) {
                mainNavigation.classList.remove('active');
            }
        });
        
        // Chiudi menu con ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                mainNavigation.classList.remove('active');
            }
        });
    }
});
