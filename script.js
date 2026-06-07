// ============================================
// DOUBLE S TRANSPORT - CLEAN WEBSITE SCRIPT
// ============================================

const WHATSAPP_NUMBER = '16492478057';

// --------------------------------------------
// Intro animation - play once per browser session
// --------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const siteIntro = document.getElementById('siteIntro');

    if (!siteIntro) return;

    const introAlreadyPlayed = sessionStorage.getItem('doubleSIntroPlayed');

    if (introAlreadyPlayed) {
        siteIntro.remove();
        document.body.classList.remove('intro-lock');
        return;
    }

    sessionStorage.setItem('doubleSIntroPlayed', 'true');
    document.body.classList.add('intro-lock');

    setTimeout(() => {
        siteIntro.classList.add('hide-intro');
        document.body.classList.remove('intro-lock');
    }, 4300);

    setTimeout(() => {
        if (siteIntro && siteIntro.parentNode) siteIntro.remove();
    }, 5300);
});

// --------------------------------------------
// Mobile menu
// --------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenuPanel = document.querySelector('.mobile-menu-panel');

    if (!mobileMenuBtn || !mobileMenuPanel) return;

    const closeMenu = () => {
        mobileMenuPanel.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
    };

    mobileMenuBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        const isOpen = mobileMenuPanel.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active', isOpen);
        mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.classList.toggle('menu-open', isOpen);
    });

    mobileMenuPanel.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.navbar')) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
    });
});

// --------------------------------------------
// Navbar shadow
// --------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const updateShadow = () => {
        navbar.style.boxShadow = window.scrollY > 80
            ? '0 14px 36px rgba(0,0,0,0.20)'
            : 'none';
    };

    updateShadow();
    window.addEventListener('scroll', updateShadow, { passive: true });
});

// --------------------------------------------
// Smooth scrolling for internal links
// --------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (event) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
});

// --------------------------------------------
// Scroll reveal animation
// --------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const revealItems = document.querySelectorAll(
        '.service-card, .vehicle-card, .feature-card, .stat-card, .contact-card, .booking-form, .booking-side, .review-card, .review-submit-box'
    );

    if (!('IntersectionObserver' in window)) {
        revealItems.forEach(item => item.classList.add('is-visible'));
        return;
    }

    revealItems.forEach(item => item.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealItems.forEach(item => revealObserver.observe(item));
});

// --------------------------------------------
// Animated counters
// --------------------------------------------
function animateCounter(element, target, duration = 1600) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(target * progress);

        element.textContent = value;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

document.addEventListener('DOMContentLoaded', () => {
    const statCards = document.querySelectorAll('.stat-card');

    if (!('IntersectionObserver' in window)) {
        statCards.forEach((card) => {
            const number = card.querySelector('.stat-number');
            if (number) number.textContent = number.dataset.target || number.textContent;
        });
        return;
    }

    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const number = entry.target.querySelector('.stat-number');
            if (number && !number.dataset.animated) {
                number.dataset.animated = 'true';
                animateCounter(number, parseInt(number.dataset.target || '0', 10));
            }

            statObserver.unobserve(entry.target);
        });
    }, { threshold: 0.5 });

    statCards.forEach(card => statObserver.observe(card));
});

// --------------------------------------------
// Booking form to WhatsApp
// --------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('bookingForm');
    if (!bookingForm) return;

    bookingForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const fullName = document.getElementById('fullName')?.value.trim();
        const phone = document.getElementById('phone')?.value.trim();
        const pickup = document.getElementById('pickup')?.value.trim();
        const destination = document.getElementById('destination')?.value.trim();
        const date = document.getElementById('date')?.value;
        const time = document.getElementById('time')?.value;
        const vehicle = document.getElementById('vehicle')?.value || 'No preference';
        const passengers = document.getElementById('passengers')?.value || 'Not specified';
        const message = document.getElementById('message')?.value.trim();

        if (!fullName || !phone || !pickup || !destination || !date || !time) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        const bookingMessage = `*Double S Transport Booking Request*\n\n` +
            `*Name:* ${fullName}\n` +
            `*Phone:* ${phone}\n` +
            `*Pickup:* ${pickup}\n` +
            `*Destination:* ${destination}\n` +
            `*Date:* ${date}\n` +
            `*Time:* ${time}\n` +
            `*Preferred Vehicle:* ${vehicle}\n` +
            `*Passengers:* ${passengers}\n` +
            `${message ? `*Special Requests:* ${message}\n` : ''}\n` +
            `Please confirm availability and pricing.`;

        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(bookingMessage)}`;

        showNotification('Opening WhatsApp to send your booking request.', 'success');
        setTimeout(() => window.open(whatsappUrl, '_blank'), 700);
    });
});

// --------------------------------------------
// Footer service request links
// --------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const serviceRequestLinks = document.querySelectorAll('.service-request-link');

    serviceRequestLinks.forEach((link) => {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            const selectedService = this.getAttribute('data-service') || 'transportation service';
            const bookingSection = document.querySelector('#booking');
            const messageBox = document.querySelector('#message');

            if (messageBox) {
                messageBox.value = `Hello Double S Transport, I would like to request ${selectedService}. Please contact me with availability and pricing.`;
            }

            if (bookingSection) {
                bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            showNotification(`${selectedService} selected. Complete your booking details.`, 'success');
        });
    });
});

// --------------------------------------------
// Review form to WhatsApp
// --------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('reviewForm');
    if (!reviewForm) return;

    reviewForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const reviewName = document.getElementById('reviewName')?.value.trim();
        const reviewService = document.getElementById('reviewService')?.value;
        const reviewRating = document.getElementById('reviewRating')?.value;
        const reviewMessage = document.getElementById('reviewMessage')?.value.trim();
        const reviewConsent = document.getElementById('reviewConsent')?.checked;
        const reviewPhotos = document.getElementById('reviewPhotos');

        if (!reviewName || !reviewService || !reviewRating || !reviewMessage || !reviewConsent) {
            showNotification('Please complete all review fields.', 'error');
            return;
        }

        const stars = '★'.repeat(Number(reviewRating)) + '☆'.repeat(5 - Number(reviewRating));
        const photoCount = reviewPhotos?.files?.length || 0;
        const photoLine = photoCount > 0
            ? `\n*Photos:* ${photoCount} photo(s) selected. Please attach them in this WhatsApp chat after sending this message.\n`
            : '';

        const whatsappText = `*NEW REVIEW - DOUBLE S TRANSPORT*\n\n` +
            `*Name:* ${reviewName}\n` +
            `*Service:* ${reviewService}\n` +
            `*Rating:* ${stars}\n\n` +
            `*Review:*\n${reviewMessage}\n` +
            photoLine +
            `\nThank you for sharing your experience with Double S Transport.`;

        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`;

        showNotification('Opening WhatsApp to submit your review.', 'success');
        setTimeout(() => window.open(whatsappUrl, '_blank'), 700);
        reviewForm.reset();
    });
});

// --------------------------------------------
// Mobile review belt duplication
// --------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const reviewsGrid = document.querySelector('.reviews-grid');
    if (!reviewsGrid) return;

    const enableReviewBelt = () => {
        if (window.innerWidth <= 768 && !reviewsGrid.classList.contains('belt-ready')) {
            const cards = Array.from(reviewsGrid.children);
            cards.forEach((card) => {
                const clone = card.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                reviewsGrid.appendChild(clone);
            });
            reviewsGrid.classList.add('belt-ready');
        }
    };

    enableReviewBelt();
});

// --------------------------------------------
// Form enhancements
// --------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date');
    if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (event) => {
            let value = event.target.value.replace(/\D/g, '');
            if (value.length > 3 && value.length <= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else if (value.length > 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            }
            event.target.value = value;
        });
    }
});

// --------------------------------------------
// Notification system
// --------------------------------------------
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 108px;
        right: 22px;
        z-index: 10000;
        max-width: 380px;
        padding: 15px 20px;
        border-radius: 6px;
        font-family: 'Montserrat', sans-serif;
        font-size: 0.95rem;
        font-weight: 700;
        animation: slideInRight 0.35s ease;
        box-shadow: 0 16px 40px rgba(0,0,0,0.18);
    `;

    if (type === 'success') {
        notification.style.background = '#25D366';
        notification.style.color = '#ffffff';
    } else if (type === 'error') {
        notification.style.background = '#ff5c5c';
        notification.style.color = '#ffffff';
    } else {
        notification.style.background = '#0A0A0A';
        notification.style.color = '#ffffff';
        notification.style.border = '1px solid rgba(255,255,255,0.18)';
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.35s ease';
        setTimeout(() => notification.remove(), 350);
    }, 3400);
}
// ============================================
// SOFT PAGE REFRESH FADE
// ============================================

window.addEventListener('load', () => {
    const pageLoadFade = document.getElementById('pageLoadFade');

    if (!pageLoadFade) return;

    setTimeout(() => {
        pageLoadFade.classList.add('fade-out');
    }, 250);

    setTimeout(() => {
        pageLoadFade.remove();
    }, 1100);
});