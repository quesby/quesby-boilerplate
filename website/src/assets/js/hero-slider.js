/**
 * Hero Slider JavaScript
 * Gestisce lo slider dinamico per gli articoli del blog
 */

class HeroSlider {
    constructor(element) {
        this.slider = element;
        this.wrapper = this.slider.querySelector('.hero-slider__wrapper');
        this.slides = this.slider.querySelectorAll('.hero-slider__slide');
        this.indicators = this.slider.querySelectorAll('.hero-slider__indicator');
        this.prevArrow = this.slider.querySelector('.hero-slider__arrow--prev');
        this.nextArrow = this.slider.querySelector('.hero-slider__arrow--next');
        this.progressBar = this.slider.querySelector('.hero-slider__progress-bar');
        this.counter = this.slider.querySelector('.hero-slider__counter');
        
        this.currentSlide = 0;
        this.autoplayInterval = null;
        this.isTransitioning = false;
        
        this.autoplay = this.slider.dataset.autoplay === 'true';
        this.autoplaySpeed = parseInt(this.slider.dataset.autoplaySpeed) || 5000;
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        this.slides[0].classList.add('active');
        this.addEventListeners();
        
        if (this.autoplay) {
            this.startAutoplay();
        }
        
        if (this.progressBar && this.autoplay) {
            this.startProgressBar();
        }
    }
    
    goToSlide(index) {
        if (this.isTransitioning || index === this.currentSlide) return;
        
        this.isTransitioning = true;
        
        this.indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        
        this.slides[this.currentSlide].classList.remove('active');
        this.slides[index].classList.add('active');
        
        // Aggiorna contatore
        if (this.counter) {
            const currentSlideSpan = this.counter.querySelector('.current-slide');
            if (currentSlideSpan) {
                currentSlideSpan.textContent = String(index + 1).padStart(2, '0');
            }
        }
        
        if (this.progressBar) {
            this.progressBar.style.width = '0%';
        }
        
        this.currentSlide = index;
        
        if (this.autoplay) {
            this.resetAutoplay();
        }
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }
    
    nextSlide() {
        const next = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(next);
    }
    
    prevSlide() {
        const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prev);
    }
    
    resetAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
        
        if (this.autoplay && this.slides.length > 1) {
            this.autoplayInterval = setInterval(() => this.nextSlide(), this.autoplaySpeed);
        }
    }
    
    startAutoplay() {
        if (this.autoplay && this.slides.length > 1) {
            this.resetAutoplay();
        }
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    }
    
    startProgressBar() {
        const updateProgress = () => {
            const progress = ((Date.now() % this.autoplaySpeed) / this.autoplaySpeed) * 100;
            this.progressBar.style.width = progress + '%';
        };
        
        setInterval(updateProgress, 100);
    }
    
    addEventListeners() {
        if (this.indicators.length > 0) {
            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => this.goToSlide(index));
            });
        }
        
        if (this.prevArrow) {
            this.prevArrow.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextArrow) {
            this.nextArrow.addEventListener('click', () => this.nextSlide());
        }
        
        this.slider.addEventListener('mouseenter', () => this.stopAutoplay());
        this.slider.addEventListener('mouseleave', () => this.startAutoplay());
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
        
        this.addTouchSupport();
    }
    
    addTouchSupport() {
        let startX = 0;
        let endX = 0;
        
        this.slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        this.slider.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        }, { passive: true });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const heroSliders = document.querySelectorAll('.hero-slider');
    heroSliders.forEach(slider => new HeroSlider(slider));
});
