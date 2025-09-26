// Search Popup Controller
document.addEventListener('DOMContentLoaded', function() {
    const searchTrigger = document.getElementById('search-trigger');
    const searchPopup = document.getElementById('search-popup');
    const searchInput = document.getElementById('q');
    
    // Show search popup
    function showSearch() {
        searchPopup.classList.add('active');
        // Focus on input after animation
        setTimeout(() => {
            searchInput.focus();
        }, 100);
    }
    
    // Hide search popup
    function hideSearch() {
        searchPopup.classList.remove('active');
        // Clear search results
        const results = document.getElementById('results');
        if (results) {
            results.innerHTML = '';
        }
        // Clear input
        searchInput.value = '';
    }
    
    // Event listeners
    if (searchTrigger) {
        searchTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            showSearch();
        });
    }
    
    // Close popup when clicking outside search area
    if (searchPopup) {
        searchPopup.addEventListener('click', function(e) {
            // Only close if clicking on the popup background, not the search container
            if (e.target === searchPopup) {
                hideSearch();
            }
        });
    }
    
    // Close popup with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchPopup.classList.contains('active')) {
            hideSearch();
        }
    });
    
    // Prevent search container clicks from closing popup
    const searchContainer = document.getElementById('search');
    if (searchContainer) {
        searchContainer.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
});