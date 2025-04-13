// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables and elements
    const navbar = document.querySelector('.navbar');
    const scrollTopBtn = createScrollTopButton();
    
    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    
    // Initialize any interactive elements
    initializeRouteDetailButtons();
    initializeDestinationButtons();
    initializeCommunityActions();
    initializeSearchFunctionality();
    initializeServiceCards();
    
    // Mobile navigation toggle
    const mobileNavToggle = createMobileNavToggle();
    
    /**
     * Creates and handles the scroll to top button
     */
    function createScrollTopButton() {
        const btn = document.createElement('button');
        btn.classList.add('scroll-top-btn');
        btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        btn.style.position = 'fixed';
        btn.style.bottom = '20px';
        btn.style.right = '20px';
        btn.style.zIndex = '99';
        btn.style.display = 'none';
        btn.style.padding = '10px 15px';
        btn.style.borderRadius = '50%';
        btn.style.backgroundColor = 'var(--primary-color)';
        btn.style.color = 'white';
        btn.style.cursor = 'pointer';
        btn.style.border = 'none';
        btn.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
        
        document.body.appendChild(btn);
        
        btn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        return btn;
    }
    
    /**
     * Creates mobile navigation toggle
     */
    function createMobileNavToggle() {
        const navLinks = document.querySelector('.nav-links');
        const authButtons = document.querySelector('.auth-buttons');
        
        // Create toggle button
        const toggle = document.createElement('button');
        toggle.classList.add('mobile-nav-toggle');
        toggle.innerHTML = '<i class="fas fa-bars"></i>';
        toggle.style.display = 'none';
        toggle.style.background = 'transparent';
        toggle.style.border = 'none';
        toggle.style.fontSize = '1.5rem';
        toggle.style.color = 'var(--primary-color)';
        toggle.style.cursor = 'pointer';
        
        // Insert toggle before navLinks
        navbar.insertBefore(toggle, navLinks);
        
        // Add responsive classes
        navLinks.classList.add('nav-links-responsive');
        authButtons.classList.add('auth-buttons-responsive');
        
        // Add CSS for responsive navigation
        const style = document.createElement('style');
        style.textContent = `
            @media screen and (max-width: 768px) {
                .mobile-nav-toggle {
                    display: block !important;
                }
                .nav-links-responsive, .auth-buttons-responsive {
                    display: none;
                    width: 100%;
                    text-align: center;
                }
                .nav-links-responsive.active, .auth-buttons-responsive.active {
                    display: flex;
                    flex-direction: column;
                }
                .navbar {
                    flex-wrap: wrap;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Toggle navigation
        toggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            authButtons.classList.toggle('active');
            
            // Change icon
            if (navLinks.classList.contains('active')) {
                toggle.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                toggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
        
        return toggle;
    }
    
    /**
     * Handle scroll events for sticky header and scroll-to-top button
     */
    function handleScroll() {
        // Show/hide scroll to top button
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
        
        // Add sticky class to navbar when scrolled
        if (window.pageYOffset > 0) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
    }
    
    /**
     * Initialize route detail buttons functionality
     */
    function initializeRouteDetailButtons() {
        const routeButtons = document.querySelectorAll('.route-info button');
        
        routeButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Get route name from parent element
                const routeCard = button.closest('.route-card');
                const routeName = routeCard.querySelector('h3').textContent;
                
                // Navigate to route detail page
                window.location.href = 'route-detail.html';
            });
        });
    }
    
    /**
     * Initialize destination buttons functionality
     */
    function initializeDestinationButtons() {
        const destButtons = document.querySelectorAll('.destination-overlay button');
        
        destButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Get destination name from parent element
                const destCard = button.closest('.destination-card');
                const destName = destCard.querySelector('h3').textContent;
                
                // Navigate to destination detail page
                window.location.href = 'destination-detail.html';
            });
        });
    }
    
    /**
     * Initialize service cards functionality
     */
    function initializeServiceCards() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            card.addEventListener('click', function() {
                const serviceTitle = card.querySelector('h3').textContent;
                
                // Route to appropriate service detail page based on title
                if (serviceTitle === '路线规划') {
                    window.location.href = 'service-detail.html';
                } else {
                    // For now, just navigate to the same page for all services
                    window.location.href = 'service-detail.html';
                }
            });
            
            // Add cursor pointer style to service cards
            card.style.cursor = 'pointer';
        });
    }
    
    /**
     * Initialize community actions: like, comment, share
     */
    function initializeCommunityActions() {
        const actionButtons = document.querySelectorAll('.post-actions button');
        
        actionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = button.textContent.trim();
                
                // In a real app, this would handle the specific action
                if (action.includes('点赞')) {
                    button.innerHTML = button.innerHTML.replace(/\((\d+)\)/g, function(match, number) {
                        return `(${parseInt(number) + 1})`;
                    });
                    button.style.color = 'var(--accent-color)';
                } else if (action.includes('评论')) {
                    alert('评论功能将在完整应用中实现！');
                } else if (action.includes('分享')) {
                    alert('分享功能将在完整应用中实现！');
                }
            });
        });
    }
    
    /**
     * Initialize search functionality
     */
    function initializeSearchFunctionality() {
        const searchForm = document.querySelector('.search-container');
        const searchInput = searchForm.querySelector('input');
        const searchButton = searchForm.querySelector('button');
        
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm) {
                // In a real app, this would perform a search
                alert(`您搜索的内容: "${searchTerm}"，搜索功能将在完整应用中实现！`);
            } else {
                alert('请输入搜索内容');
            }
        });
    }
    
    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for header
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                document.querySelector('.nav-links').classList.remove('active');
                document.querySelector('.auth-buttons').classList.remove('active');
                if (window.innerWidth <= 768) {
                    document.querySelector('.mobile-nav-toggle').innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });
}); 