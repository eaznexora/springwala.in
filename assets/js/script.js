document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('close-menu').addEventListener('click', closeMenu);
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
    // Wishlist Toggle Logic
    const wishlistButtons = document.querySelectorAll('.fo-wishlist');

    wishlistButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent accidental navigation if inside a link
            const img = button.querySelector('img');
            if (img) {
                const currentSrc = img.getAttribute('src');
                if (currentSrc.includes('star.svg')) {
                    img.setAttribute('src', 'assets/icons/mobile/star-gold.svg');
                } else {
                    img.setAttribute('src', 'assets/icons/mobile/star.svg');
                }
            }
        });
    });

    // Mobile Sticky Header Scroll Logic
    let lastScrollTop = 0;
    const mobileSubHeader = document.getElementById('mobile-sub-header');
    let scrollDelta = 0;
    let isHeaderAnimating = false;

    window.addEventListener('scroll', () => {
        if (!mobileSubHeader || isHeaderAnimating) {
            lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return;
        }

        let st = window.pageYOffset || document.documentElement.scrollTop;
        if (st < 0) return; // Prevent Safari bounce

        let diff = st - lastScrollTop;

        // Reset delta if direction changes
        if ((diff > 0 && scrollDelta < 0) || (diff < 0 && scrollDelta > 0)) {
            scrollDelta = 0;
        }

        scrollDelta += diff;

        // Add threshold of 50px from top and 15px scroll delta
        if (scrollDelta > 15 && st > 50 && !mobileSubHeader.classList.contains('hide-sub')) {
            // Scroll Down - Hide
            mobileSubHeader.classList.add('hide-sub');
            isHeaderAnimating = true;
            setTimeout(() => { isHeaderAnimating = false; scrollDelta = 0; }, 350);
        } else if (scrollDelta < -15 && mobileSubHeader.classList.contains('hide-sub')) {
            // Scroll Up - Show
            mobileSubHeader.classList.remove('hide-sub');
            isHeaderAnimating = true;
            setTimeout(() => { isHeaderAnimating = false; scrollDelta = 0; }, 350);
        }

        lastScrollTop = st;
    }, { passive: true });
});

// Geolocation Logic for Mobile Header
const locationBtn = document.getElementById('location-btn');
const locationText = document.getElementById('location-text');

if (locationBtn && locationText) {
    locationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            // Ask for permission and get coordinates
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    locationText.textContent = "Fetching...";

                    // Reverse Geocoding using OpenStreetMap (Nominatim)
                    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
                        .then(response => response.json())
                        .then(data => {
                            const address = data.address;
                            // Prefer City/Town/Village, then State
                            const city = address.city || address.town || address.village || address.suburb || "Unknown";
                            const state = address.state || "";

                            if (city && state) {
                                locationText.textContent = `${city}, ${state}`;
                            } else {
                                locationText.textContent = data.display_name.split(',')[0]; // Fallback to first part of address
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching address:', error);
                            locationText.textContent = "Location Error";
                            alert("Could not fetch address details.");
                        });
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    let msg = "Location Access Denied";
                    if (error.code === 2) msg = "Position Unavailable";
                    if (error.code === 3) msg = "Timeout";
                    locationText.textContent = "Use Default";
                    alert(msg + ". Please enable location services.");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    });
}