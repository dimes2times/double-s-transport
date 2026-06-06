// ============================================
// DOUBLE S TRANSPORT - WEBSITE INTERACTIONS
// ============================================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');
const bookingForm = document.getElementById('bookingForm');

const WHATSAPP_NUMBER = '16492478057';

// Mobile menu
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu?.classList.remove('active');
    });
});

document.addEventListener('click', event => {
    if (!event.target.closest('.navbar')) {
        navMenu?.classList.remove('active');
    }
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        navMenu?.classList.remove('active');
    }
});

// Navbar shadow on scroll
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (!navbar) return;

    if (window.scrollY > 80) {
        navbar.style.boxShadow = '0 14px 36px rgba(0,0,0,0.20)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// Scroll reveal
const revealItems = document.querySelectorAll(
    '.service-card, .vehicle-card, .feature-card, .stat-card, .contact-card, .booking-form, .booking-side'
);

revealItems.forEach(item => item.classList.add('reveal'));

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15
});

revealItems.forEach(item => revealObserver.observe(item));

// Animated counters
function animateCounter(element, target, duration = 1600) {
    let start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(start + (target - start) * progress);

        element.textContent = value;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const number = entry.target.querySelector('.stat-number');

        if (number && !number.dataset.animated) {
            number.dataset.animated = 'true';
            animateCounter(number, parseInt(number.dataset.target, 10));
        }

        statObserver.unobserve(entry.target);
    });
}, {
    threshold: 0.5
});

document.querySelectorAll('.stat-card').forEach(card => statObserver.observe(card));

// Booking form to WhatsApp
if (bookingForm) {
    bookingForm.addEventListener('submit', event => {
        event.preventDefault();

        const fullName = document.getElementById('fullName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const pickup = document.getElementById('pickup').value.trim();
        const destination = document.getElementById('destination').value.trim();
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const vehicle = document.getElementById('vehicle').value;
        const passengers = document.getElementById('passengers').value;
        const message = document.getElementById('message').value.trim();

        if (!fullName || !phone || !pickup || !destination || !date || !time) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        const bookingMessage = `*Double S Transport Booking Request*

*Name:* ${fullName}
*Phone:* ${phone}
*Pickup:* ${pickup}
*Destination:* ${destination}
*Date:* ${date}
*Time:* ${time}
*Preferred Vehicle:* ${vehicle}
*Passengers:* ${passengers}
${message ? `*Special Requests:* ${message}` : ''}

Please confirm availability and pricing.`;

        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(bookingMessage)}`;

        showNotification('Opening WhatsApp to send your booking request.', 'success');

        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 700);
    });
}

// Date picker minimum date
const dateInput = document.getElementById('date');

if (dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];
}

// Notification system
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
// FOOTER SERVICE REQUEST LINKS
// ============================================

const serviceRequestLinks = document.querySelectorAll('.service-request-link');

serviceRequestLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        const selectedService = this.getAttribute('data-service');
        const bookingSection = document.querySelector('#booking');
        const messageBox = document.querySelector('#message');

        const serviceMessage = `Hello Double S Transport, I would like to request ${selectedService}. Please contact me with availability and pricing.`;

        if (messageBox) {
            messageBox.value = serviceMessage;
        }

        if (bookingSection) {
            bookingSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        showNotification(`${selectedService} selected. Complete your booking details.`, 'success');
    });
});
// ============================================
// PREMIUM INTRO ANIMATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const siteIntro = document.getElementById('siteIntro');

    if (!siteIntro) return;

    document.body.classList.add('intro-lock');

    setTimeout(() => {
        siteIntro.classList.add('hide-intro');
        document.body.classList.remove('intro-lock');
    }, 2900);

    setTimeout(() => {
        siteIntro.remove();
    }, 3900);
});
// ============================================
// REVIEW FORM - SEND TO WHATSAPP FOR APPROVAL
// ============================================

const reviewForm = document.getElementById('reviewForm');

if (reviewForm) {
    reviewForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const reviewName = document.getElementById('reviewName').value.trim();
        const reviewService = document.getElementById('reviewService').value;
        const reviewRating = document.getElementById('reviewRating').value;
        const reviewMessage = document.getElementById('reviewMessage').value.trim();
        const reviewConsent = document.getElementById('reviewConsent').checked;

        if (!reviewName || !reviewService || !reviewRating || !reviewMessage || !reviewConsent) {
            if (typeof showNotification === 'function') {
                showNotification('Please complete all review fields.', 'error');
            } else {
                alert('Please complete all review fields.');
            }
            return;
        }

        const stars = '★'.repeat(Number(reviewRating)) + '☆'.repeat(5 - Number(reviewRating));

        const whatsappText = encodeURIComponent(
            `*NEW REVIEW SUBMISSION - DOUBLE S TRANSPORT*\n\n` +
            `*Name:* ${reviewName}\n` +
            `*Service:* ${reviewService}\n` +
            `*Rating:* ${stars}\n\n` +
            `*Review:*\n${reviewMessage}\n\n` +
            `Please review this before publishing it on the website.`
        );

        const whatsappUrl = `https://wa.me/16492478057?text=${whatsappText}`;

        if (typeof showNotification === 'function') {
            showNotification('Opening WhatsApp to submit your review for approval.', 'success');
        }

        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 700);

        reviewForm.reset();
    });
}