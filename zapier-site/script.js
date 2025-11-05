// Banner close functionality
document.addEventListener('DOMContentLoaded', function() {
    const closeBanner = document.querySelector('.close-banner');
    const topBanner = document.querySelector('.top-banner');
    
    if (closeBanner && topBanner) {
        closeBanner.addEventListener('click', function() {
            topBanner.style.display = 'none';
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // AI Chart Animation
    const aiChart = document.getElementById('aiChart');
    if (aiChart) {
        const ctx = aiChart.getContext('2d');
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, 'rgba(255, 106, 0, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 106, 0, 0.1)');
        
        // Chart data
        const data = [
            { x: 0, y: 20 },
            { x: 50, y: 35 },
            { x: 100, y: 45 },
            { x: 150, y: 60 },
            { x: 200, y: 75 },
            { x: 250, y: 85 },
            { x: 300, y: 95 },
            { x: 350, y: 100 }
        ];
        
        // Draw chart
        ctx.strokeStyle = '#ff6a00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        data.forEach((point, index) => {
            const x = point.x;
            const y = 200 - (point.y * 1.5);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Fill area under curve
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, 200);
        
        data.forEach(point => {
            const x = point.x;
            const y = 200 - (point.y * 1.5);
            ctx.lineTo(x, y);
        });
        
        ctx.lineTo(350, 200);
        ctx.closePath();
        ctx.fill();
        
        // Add axis labels
        ctx.fillStyle = 'white';
        ctx.font = '12px Inter';
        ctx.fillText('2022', 0, 220);
        ctx.fillText('2023', 300, 220);
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.hero-text, .integrations-text, .testimonial-text, .ai-text, .ai-features');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Counter animation for AI number
    const aiNumber = document.querySelector('.ai-number');
    if (aiNumber) {
        const targetNumber = 255232250;
        const duration = 2000;
        const increment = targetNumber / (duration / 16);
        let currentNumber = 0;
        
        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const timer = setInterval(() => {
                        currentNumber += increment;
                        if (currentNumber >= targetNumber) {
                            currentNumber = targetNumber;
                            clearInterval(timer);
                        }
                        aiNumber.textContent = Math.floor(currentNumber).toLocaleString();
                    }, 16);
                    counterObserver.unobserve(entry.target);
                }
            });
        });
        
        counterObserver.observe(aiNumber);
    }

    // Testimonial navigation
    const prevBtn = document.querySelector('.nav-arrow.prev');
    const nextBtn = document.querySelector('.nav-arrow.next');
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', function() {
            // Add testimonial navigation logic here
            console.log('Previous testimonial');
        });
        
        nextBtn.addEventListener('click', function() {
            // Add testimonial navigation logic here
            console.log('Next testimonial');
        });
    }

    // Button hover effects
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-dark, .btn-light');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Workflow node interactions
    const workflowNodes = document.querySelectorAll('.workflow-node');
    workflowNodes.forEach(node => {
        node.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 8px 25px rgba(255, 106, 0, 0.3)';
        });
        
        node.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
        });
    });

    // Tool button interactions
    const toolButtons = document.querySelectorAll('.tool-btn');
    toolButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Add tool selection logic here
            console.log('Selected tool:', this.textContent);
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Parallax effect for hero graphic
    const heroGraphic = document.querySelector('.hero-graphic');
    if (heroGraphic) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroGraphic.style.transform = `translateY(${rate}px)`;
        });
    }

    // Logo scroll pause on hover
    const logoScroll = document.querySelector('.logo-scroll');
    if (logoScroll) {
        logoScroll.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
        });
        
        logoScroll.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
        });
    }

    // Feature item animations
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        const featureObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }
            });
        });
        
        featureObserver.observe(item);
    });

    // Solution item hover effects
    const solutionItems = document.querySelectorAll('.solution-item');
    solutionItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Mobile menu toggle (for future implementation)
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.style.display = 'none';
    
    // Add mobile menu styles
    const mobileStyles = `
        @media (max-width: 768px) {
            .mobile-menu-toggle {
                display: block !important;
                background: none;
                border: none;
                font-size: 24px;
                color: #1a1a1a;
                cursor: pointer;
            }
            
            .nav {
                display: none;
            }
            
            .nav.active {
                display: flex;
                flex-direction: column;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border-top: 1px solid #e5e5e5;
                padding: 20px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = mobileStyles;
    document.head.appendChild(styleSheet);
    
    // Add mobile menu functionality
    if (window.innerWidth <= 768) {
        const nav = document.querySelector('.nav');
        const headerContent = document.querySelector('.header-content');
        
        if (nav && headerContent) {
            headerContent.appendChild(mobileMenuToggle);
            mobileMenuToggle.style.display = 'block';
            
            mobileMenuToggle.addEventListener('click', function() {
                nav.classList.toggle('active');
            });
        }
    }
}); 