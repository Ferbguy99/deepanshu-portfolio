// Portfolio JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navToggle) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navToggle && navMenu) {
            const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
            
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
    });

    // Enhanced smooth scrolling with proper offset for fixed navbar
    function smoothScrollToSection(targetId) {
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 70;
            const targetPosition = targetSection.offsetTop - navbarHeight - 10;
            
            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: 'smooth'
            });
            
            // Force update active nav link after scroll completes
            setTimeout(() => {
                updateActiveNavLink();
            }, 500);
        }
    }

    // Handle navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                smoothScrollToSection(targetId);
            }
        });
    });

    // Handle CTA button click
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            smoothScrollToSection('contact');
        });
    }

    // Active navigation highlighting with improved logic
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 70;
        const scrollPosition = window.scrollY + navbarHeight + 50;

        let activeSection = null;
        let minDistance = Infinity;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeSection = sectionId;
            }
            
            const distanceToTop = Math.abs(scrollPosition - sectionTop);
            if (distanceToTop < minDistance) {
                minDistance = distanceToTop;
                if (distanceToTop < 100) { 
                    activeSection = sectionId;
                }
            }
        });

        if (window.scrollY < 100) {
            activeSection = 'home';
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref === `#${activeSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Throttle scroll events for better performance
    function throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    window.addEventListener('scroll', throttle(updateActiveNavLink, 50));
    setTimeout(updateActiveNavLink, 100);

    // Enhanced notification system
    function showNotification(message, type = 'info') {
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: inherit; font-size: 18px; cursor: pointer; margin-left: 10px;">&times;</button>
            </div>
        `;
        
        const baseStyles = {
            position: 'fixed',
            top: '90px',
            right: '20px',
            padding: '16px 20px',
            borderRadius: '8px',
            fontWeight: '500',
            fontSize: '14px',
            zIndex: '2000',
            maxWidth: '350px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease-in-out',
            fontFamily: 'var(--font-family-base)'
        };

        Object.assign(notification.style, baseStyles);

        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#10b981';
                notification.style.color = 'white';
                notification.style.border = '1px solid #059669';
                break;
            case 'error':
                notification.style.backgroundColor = '#ef4444';
                notification.style.color = 'white';
                notification.style.border = '1px solid #dc2626';
                break;
            case 'warning':
                notification.style.backgroundColor = '#f59e0b';
                notification.style.color = 'white';
                notification.style.border = '1px solid #d97706';
                break;
            default:
                notification.style.backgroundColor = 'var(--color-surface)';
                notification.style.color = 'var(--color-text)';
                notification.style.border = '1px solid var(--color-border)';
        }

        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);

        return notification;
    }

    function isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email) && email.length <= 254; 
    }

    // Contact form handling 
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const name = formData.get('name')?.trim();
            const email = formData.get('email')?.trim();
            const message = formData.get('message')?.trim();

            if (!name) return showNotification('Please enter your name.', 'error');
            if (!email) return showNotification('Please enter your email address.', 'error');
            if (!isValidEmail(email)) return showNotification('Please enter a valid email address.', 'error');
            if (!message) return showNotification('Please enter a message.', 'error');
            if (message.length < 10) return showNotification('Please enter a more detailed message (at least 10 characters).', 'warning');

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            submitButton.style.opacity = '0.7';

            setTimeout(() => {
                contactForm.reset();
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
                submitButton.style.opacity = '1';
                showNotification(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
            }, 1500);
        });

        // Real-time validation feedback
        const inputs = [
            { field: contactForm.querySelector('#name'), validate: val => val.trim() },
            { field: contactForm.querySelector('#email'), validate: val => isValidEmail(val.trim()) },
            { field: contactForm.querySelector('#message'), validate: val => val.trim().length >= 10 }
        ];

        inputs.forEach(({ field, validate }) => {
            if (field) {
                field.addEventListener('blur', function() {
                    this.style.borderColor = validate(this.value) ? '#10b981' : '#ef4444';
                });
            }
        });
    }

    // Skill card hover animation & click-to-copy
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.skill-card-icon i');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });

        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.skill-card-icon i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    const skillListItems = document.querySelectorAll('.skill-card-list li');
    skillListItems.forEach(item => {
        item.addEventListener('click', function() {
            const techName = this.textContent.trim();
            
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(techName).then(() => {
                    showNotification(`Copied skill: ${techName}`, 'success');
                    
                    const originalBg = this.style.backgroundColor;
                    const originalColor = this.style.color;
                    this.style.backgroundColor = 'var(--primary-blue)';
                    this.style.color = 'white';
                    
                    setTimeout(() => {
                        this.style.backgroundColor = originalBg;
                        this.style.color = originalColor;
                    }, 300);
                }).catch(() => fallbackCopyTextToClipboard(techName));
            } else {
                fallbackCopyTextToClipboard(techName);
            }
        });
        item.style.cursor = 'pointer';
        item.title = 'Click to copy skill name';
    });

    // Scroll-based animations
    function animateOnScroll() {
        const animatedElements = document.querySelectorAll('.card, .timeline-item, .skill-card');
        
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < window.innerHeight - 150) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    const animatedElements = document.querySelectorAll('.card, .timeline-item, .skill-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    window.addEventListener('scroll', throttle(animateOnScroll, 100));
    setTimeout(animateOnScroll, 500);

    // Smooth reveal animation for hero section
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(50px)';
        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }

    // Add typing effect to hero subtitle
    function typeWriter(element, text, speed = 80) {
        if (!element) return;
        let i = 0;
        element.textContent = '';
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        setTimeout(type, 1000);
    }

    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        typeWriter(heroSubtitle, originalText, 60);
    }

    // Hero contact items click-to-copy functionality
    const heroContactItems = document.querySelectorAll('.hero-contact .contact-item');
    heroContactItems.forEach(item => {
        const span = item.querySelector('span');
        const link = item.querySelector('a');
        
        if (span && !link) { 
            item.style.cursor = 'pointer';
            item.title = 'Click to copy';
            
            item.addEventListener('click', function() {
                const textToCopy = span.textContent.replace(/\/g, '').trim();
                
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        showNotification(`Copied: ${textToCopy}`, 'success');
                    }).catch(() => fallbackCopyTextToClipboard(textToCopy));
                } else {
                    fallbackCopyTextToClipboard(textToCopy);
                }
            });

            item.addEventListener('mouseenter', function() {
                this.style.backgroundColor = 'var(--color-bg-1)';
                this.style.borderRadius = 'var(--radius-sm)';
                this.style.padding = 'var(--space-4) var(--space-8)';
                this.style.margin = '-4px -8px';
                this.style.transition = 'all 0.2s ease';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'transparent';
                this.style.padding = '0';
                this.style.margin = '0';
            });
        }
    });

    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy') ? showNotification(`Copied: ${text}`, 'success') : showNotification('Failed to copy text', 'error');
        } catch (err) {
            showNotification('Failed to copy text', 'error');
        }
        document.body.removeChild(textArea);
    }
});
