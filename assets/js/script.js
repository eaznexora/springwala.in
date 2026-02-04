document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;

    /**
     * Toggles the Mobile Sidebar
     */
    function toggleMenu() {
        if (mobileMenu.classList.contains('hidden-menu')) {
            openMenu();
        } else {
            closeMenu();
        }
    }

    function openMenu() {
        mobileMenu.classList.remove('hidden-menu');
        mobileMenu.classList.add('show-menu');
        body.classList.add('overflow-hidden'); // Prevent background scrolling
    }

    function closeMenu() {
        mobileMenu.classList.remove('show-menu');
        mobileMenu.classList.add('hidden-menu');
        body.classList.remove('overflow-hidden');
    }

    // Event Listener for the Hamburger Click
    if (menuBtn) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    // Close menu when clicking outside of it
    window.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenu.classList.contains('hidden-menu')) {
            closeMenu();
        }
    });
});