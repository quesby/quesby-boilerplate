// Search Popup Controller
document.addEventListener('DOMContentLoaded', function() {
    const searchTrigger = document.getElementById('search-trigger');
    const searchPopup = document.getElementById('search-popup');
    const searchInput = document.getElementById('q');
    
    let searchLoaded = false;
    
    // Load script dynamically
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }
    
    // Ensure search scripts are loaded
    async function ensureSearchLoaded() {
        if (searchLoaded) return;
        
        try {
            // Load MiniSearch first (exposes window.MiniSearch)
            await loadScript('/assets/js/minisearch.min.js');
            // Then load search.js (uses MiniSearch and sets up search logic)
            await loadScript('/assets/js/search.js');
            searchLoaded = true;
        } catch (error) {
            console.error('Error loading search scripts:', error);
            const results = document.getElementById('results');
            if (results) {
                results.innerHTML = '<li>Error loading search. Please refresh the page.</li>';
            }
        }
    }
    
    // Show search popup
    async function showSearch() {
        await ensureSearchLoaded();
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