class PortfolioSlider {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.slide');
        this.totalSlides = this.slides.length;
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentSlideSpan = document.querySelector('.current-slide');
        this.totalSlidesSpan = document.querySelector('.total-slides');
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        // Set total slides number
        this.totalSlidesSpan.textContent = this.totalSlides;
        
        // Add event listeners
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Touch/swipe support for mobile
        this.addTouchSupport();
        
        // Update navigation state
        this.updateNavigationState();
        
        // Update initial project title
        this.updateProjectTitle();
        
        // Auto-play functionality (optional - can be enabled)
        // this.startAutoPlay();
        
        // Preload images for better performance
        this.preloadImages();
        
        // Setup lazy loading fallback for older browsers
        this.setupLazyLoading();
        
        // Ensure first image (eager loaded) gets loaded class
        const firstImg = this.slides[0].querySelector('img');
        if (firstImg) {
            if (firstImg.complete && firstImg.naturalWidth !== 0) {
                firstImg.classList.add('loaded');
            } else {
                firstImg.addEventListener('load', () => {
                    firstImg.classList.add('loaded');
                });
            }
        }
    }
    
    handleKeydown(e) {
        if (this.isTransitioning) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.prevSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides - 1);
                break;
        }
    }
    
    addTouchSupport() {
        let startX = 0;
        let endX = 0;
        let startY = 0;
        let endY = 0;
        const slidesContainer = document.getElementById('slidesContainer');
        
        slidesContainer.addEventListener('touchstart', (e) => {
            // Only enable swipe for screens less than 1024px
            if (window.innerWidth >= 1024) return;
            
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        slidesContainer.addEventListener('touchend', (e) => {
            // Only enable swipe for screens less than 1024px
            if (window.innerWidth >= 1024) return;
            
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe(startX, endX, startY, endY);
        }, { passive: true });
        
        // Listen for window resize to enable/disable touch based on screen size
        window.addEventListener('resize', () => {
            // Touch support is handled dynamically in the touch events
        });
    }
    
    handleSwipe(startX, endX, startY, endY) {
        const threshold = 50; // Minimum swipe distance
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Make sure it's a horizontal swipe (not vertical scroll)
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                // Swiped left - go to next slide
                this.nextSlide();
            } else {
                // Swiped right - go to previous slide
                this.prevSlide();
            }
        }
    }
    
    prevSlide() {
        if (this.isTransitioning) return;
        
        const newSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
        this.goToSlide(newSlide);
    }
    
    nextSlide() {
        if (this.isTransitioning) return;
        
        const newSlide = this.currentSlide === this.totalSlides - 1 ? 0 : this.currentSlide + 1;
        this.goToSlide(newSlide);
    }
    
    goToSlide(slideIndex) {
        if (this.isTransitioning || slideIndex === this.currentSlide) return;
        
        this.isTransitioning = true;
        
        // Remove active class from current slide
        this.slides[this.currentSlide].classList.remove('active');
        
        // Add prev class for exit animation
        if (slideIndex > this.currentSlide) {
            this.slides[this.currentSlide].classList.add('prev');
        }
        
        // Update current slide
        this.currentSlide = slideIndex;
        
        // Preload adjacent images for smooth navigation
        this.preloadAdjacentImages(slideIndex);
        
        // Add active class to new slide
        setTimeout(() => {
            this.slides[this.currentSlide].classList.add('active');
            this.updateNavigationState();
            this.updateProjectTitle();
            
            // Clean up prev classes
            this.slides.forEach(slide => slide.classList.remove('prev'));
            
            // Allow transitions again
            setTimeout(() => {
                this.isTransitioning = false;
            }, 100);
        }, 50);
        
        // Update slide counter
        this.currentSlideSpan.textContent = this.currentSlide + 1;
        
        // Trigger animation completion after transition
        setTimeout(() => {
            this.onSlideChange();
        }, 600);
    }
    
    updateNavigationState() {
        // Update button states (optional - remove if you want infinite loop)
        // this.prevBtn.disabled = this.currentSlide === 0;
        // this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
        
        // Add visual feedback
        this.prevBtn.style.opacity = this.currentSlide === 0 ? '0.6' : '1';
        this.nextBtn.style.opacity = this.currentSlide === this.totalSlides - 1 ? '0.6' : '1';
    }
    
    updateProjectTitle() {
        // Update the CSS custom property for the project title
        const currentSlideElement = this.slides[this.currentSlide];
        const slideContent = currentSlideElement.querySelector('.slide-content');
        if (slideContent) {
            slideContent.style.setProperty('--project-title', `'Project ${this.currentSlide + 1}'`);
        }
    }
    
    onSlideChange() {
        // Hook for when slide changes - can be used for analytics, etc.
        console.log(`Slide changed to: ${this.currentSlide + 1}`);
        
        // Trigger any slide-specific animations or actions
        const currentSlideElement = this.slides[this.currentSlide];
        const image = currentSlideElement.querySelector('img');
        
        // Add a subtle bounce effect to the image
        if (image) {
            image.style.transform = 'scale(1.02)';
            setTimeout(() => {
                image.style.transform = 'scale(1)';
            }, 300);
        }
    }
    
    preloadImages() {
        // Preload the first few images for better UX
        // First image is already loading eagerly
        // Preload next 2 images for smoother transitions
        for (let i = 1; i < Math.min(3, this.totalSlides); i++) {
            const img = this.slides[i].querySelector('img');
            if (img && img.src) {
                const preloadImg = new Image();
                preloadImg.src = img.src;
            }
        }
    }
    
    preloadAdjacentImages(currentIndex) {
        // Preload previous and next images when navigating
        const indicesToPreload = [
            currentIndex - 1,
            currentIndex + 1
        ].filter(index => index >= 0 && index < this.totalSlides);
        
        indicesToPreload.forEach(index => {
            const img = this.slides[index].querySelector('img');
            if (img && img.src && !img.complete) {
                const preloadImg = new Image();
                preloadImg.src = img.src;
            }
        });
    }
    
    setupLazyLoading() {
        // Enhanced lazy loading with Intersection Observer for better browser support
        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        img.classList.remove('lazy');
                        lazyImageObserver.unobserve(img);
                    }
                });
            }, {
                // Start loading when image is 50px away from viewport
                rootMargin: '50px'
            });

            // Observe all lazy images
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            lazyImages.forEach(img => {
                lazyImageObserver.observe(img);
                
                // Add loaded class when image finishes loading
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
                
                // Handle images that are already loaded
                if (img.complete && img.naturalWidth !== 0) {
                    img.classList.add('loaded');
                }
            });
        }
        
        // Fallback for browsers without Intersection Observer
        else {
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            lazyImages.forEach(img => {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
                
                if (img.complete && img.naturalWidth !== 0) {
                    img.classList.add('loaded');
                }
            });
        }
    }
    
    startAutoPlay(interval = 8000) {
        // Optional auto-play functionality
        this.autoPlayInterval = setInterval(() => {
            if (!this.isTransitioning) {
                this.nextSlide();
            }
        }, interval);
        
        // Pause auto-play on user interaction
        const pauseAutoPlay = () => {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
                this.autoPlayInterval = null;
            }
        };
        
        // Resume auto-play after inactivity
        let inactivityTimer;
        const resumeAutoPlay = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                if (!this.autoPlayInterval) {
                    this.startAutoPlay(interval);
                }
            }, 3000);
        };
        
        // Add event listeners for auto-play control
        ['click', 'keydown', 'touchstart'].forEach(event => {
            document.addEventListener(event, () => {
                pauseAutoPlay();
                resumeAutoPlay();
            });
        });
    }
    
    // Public methods for external control
    getCurrentSlide() {
        return this.currentSlide;
    }
    
    getTotalSlides() {
        return this.totalSlides;
    }
    
    destroy() {
        // Clean up event listeners and intervals
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
        
        // Remove event listeners
        this.prevBtn.removeEventListener('click', () => this.prevSlide());
        this.nextBtn.removeEventListener('click', () => this.nextSlide());
        document.removeEventListener('keydown', (e) => this.handleKeydown(e));
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize the portfolio slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation
    document.body.classList.add('loading');
    
    // Initialize slider
    const portfolioSlider = new PortfolioSlider();
    
    // Make slider globally accessible for debugging
    window.portfolioSlider = portfolioSlider;
    
    // Remove loading state
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 500);
    
    // Add smooth scroll behavior for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Handle window resize
    const handleResize = debounce(() => {
        // Recalculate dimensions if needed
        console.log('Window resized');
    }, 250);
    
    window.addEventListener('resize', handleResize);
    
    // Add focus management for better accessibility
    document.addEventListener('focusin', (e) => {
        if (e.target.matches('.nav-btn')) {
            e.target.style.transform = 'scale(1.1)';
        }
    });
    
    document.addEventListener('focusout', (e) => {
        if (e.target.matches('.nav-btn')) {
            e.target.style.transform = '';
        }
    });
    
    // Add visual feedback for interactions
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(button => {
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = '';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
});

// Handle page visibility changes (pause/resume functionality)
document.addEventListener('visibilitychange', () => {
    if (window.portfolioSlider) {
        if (document.hidden) {
            // Page is hidden - pause any animations
            console.log('Page hidden - pausing animations');
        } else {
            // Page is visible - resume animations
            console.log('Page visible - resuming animations');
        }
    }
});

// Add error handling for images
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        console.warn('Image failed to load:', e.target.src);
        // The onerror attribute in HTML will handle fallback
    }
}, true);

// Performance optimization: Intersection Observer for lazy loading
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    // Observe images with data-src attribute (for future lazy loading implementation)
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}