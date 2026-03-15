document.addEventListener('DOMContentLoaded', function () {

    // ============================================
    // THEME TOGGLE
    // ============================================

    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    // ============================================
    // HAMBURGER MENU
    // ============================================

    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // ============================================
    // DYNAMIC NAVIGATION HIGHLIGHTING
    // ============================================

    // Get current page path
    let currentPath = window.location.pathname;
    let page = currentPath.split("/").pop();

    // If root or empty, default to index.html
    if (page === "" || page === "/") {
        page = "index.html";
    }

    // Update active class on nav links
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        // Remove active class from all
        link.classList.remove('active');

        // Add active class if href matches current page
        const href = link.getAttribute('href');
        if (href === page || (href === 'index.html' && page === '')) {
            link.classList.add('active');
        }
    });

    // ============================================
    // SMOOTH SCROLL
    // ============================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // ============================================
    // DEMO MODAL
    // ============================================

    const demoBtn = document.getElementById('demoBtn');
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modalClose');

    if (demoBtn && modal && modalClose) {
        demoBtn.addEventListener('click', () => {
            modal.classList.add('active');
        });

        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.classList.remove('active');
            }
        });
    }

    console.log('✅ TaskBoard Manager multi-page app loaded successfully!');
});