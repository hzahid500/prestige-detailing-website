// public/js/main.js

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form handling
const bookingForm = document.querySelector('#booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;

        // Gather form data
        const formData = new FormData(bookingForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/book-appointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                // Show success message
                showNotification('Appointment booked successfully! Check your email for confirmation.', 'success');
                bookingForm.reset();
            } else {
                throw new Error(result.error || 'Something went wrong');
            }
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Dynamic service price calculator
const serviceSelect = document.querySelector('#service-select');
const priceDisplay = document.querySelector('#price-display');

const servicePrices = {
    'Signature Detail': 299,
    'Ceramic Coating': 899,
    'Paint Correction': 499,
    'Interior Detail': 199,
    'Exterior Detail': 249
};

if (serviceSelect && priceDisplay) {
    serviceSelect.addEventListener('change', () => {
        const selectedService = serviceSelect.value;
        const price = servicePrices[selectedService];
        if (price) {
            priceDisplay.textContent = `Estimated Price: $${price}`;
        } else {
            priceDisplay.textContent = 'Please select a service';
        }
    });
}

// Image lazy loading
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});

// Navigation menu for mobile
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Add some animation when scrolling
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.classList.add('animated');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);

// Scroll Progress Indicator
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
};

// Dynamic Navigation
const initNavigation = () => {
    const nav = document.querySelector('nav');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.nav-links');
    
    // Scroll behavior
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
};

// Service Cards Animation
const initServiceCards = () => {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            const img = card.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1.1)';
            }
        });

        card.addEventListener('mouseleave', (e) => {
            const img = card.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1)';
            }
        });
    });
};

// Dynamic Pricing Calculator
const initPricingCalculator = () => {
    const calculator = document.createElement('div');
    calculator.className = 'pricing-calculator';
    calculator.innerHTML = `
        <h3>Custom Package Calculator</h3>
        <div class="calculator-options">
            <label>
                <div class="service-name">
                    <i class="fas fa-spray-can service-icon"></i>
                    <div>
                        <div>Exterior Wash</div>
                        <div class="price-details">Hand wash & dry, wheel cleaning</div>
                    </div>
                </div>
                <div class="price-group">
                    <div class="price">$50</div>
                    <input type="checkbox" data-price="50" name="exterior-wash">
                </div>
            </label>
            <label>
                <div class="service-name">
                    <i class="fas fa-vacuum-robot service-icon"></i>
                    <div>
                        <div>Interior Clean</div>
                        <div class="price-details">Vacuum, wipe-down, glass cleaning</div>
                    </div>
                </div>
                <div class="price-group">
                    <div class="price">$30</div>
                    <input type="checkbox" data-price="30" name="interior-clean">
                </div>
            </label>
            <label>
                <div class="service-name">
                    <i class="fas fa-magic service-icon"></i>
                    <div>
                        <div>Paint Correction</div>
                        <div class="price-details">Remove scratches & swirl marks</div>
                    </div>
                </div>
                <div class="price-group">
                    <div class="price">$100</div>
                    <input type="checkbox" data-price="100" name="paint-correction">
                </div>
            </label>
            <label>
                <div class="service-name">
                    <i class="fas fa-shield-alt service-icon"></i>
                    <div>
                        <div>Ceramic Coating</div>
                        <div class="price-details">Long-lasting paint protection</div>
                    </div>
                </div>
                <div class="price-group">
                    <div class="price">$150</div>
                    <input type="checkbox" data-price="150" name="ceramic-coating">
                </div>
            </label>
        </div>
        <div class="total">
            <div class="total-label">Total Package Price</div>
            <div>$<span id="total-price">0</span></div>
            <div class="selected-services">No services selected</div>
        </div>
    `;

    const servicesSection = document.querySelector('#services');
    if (servicesSection) {
        servicesSection.appendChild(calculator);
    }

    const updateTotal = () => {
        const checked = document.querySelectorAll('.calculator-options input:checked');
        const total = Array.from(checked).reduce((sum, input) => {
            return sum + parseFloat(input.dataset.price);
        }, 0);
        
        // Animate the total price change
        const totalElement = document.getElementById('total-price');
        animateNumber(totalElement, parseFloat(totalElement.textContent), total);

        // Update selected services text
        const selectedServices = Array.from(checked).map(input => {
            return input.closest('label').querySelector('.service-name div div:first-child').textContent;
        });
        
        const selectedServicesElement = document.querySelector('.selected-services');
        if (selectedServices.length === 0) {
            selectedServicesElement.textContent = 'No services selected';
        } else {
            selectedServicesElement.textContent = `Selected: ${selectedServices.join(', ')}`;
        }
    };

    // Number animation function
    const animateNumber = (element, start, end) => {
        const duration = 500;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = start + (end - start) * progress;
            element.textContent = current.toFixed(2);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    };

    calculator.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', (e) => {
            const label = e.target.closest('label');
            if (e.target.checked) {
                label.style.borderColor = 'var(--primary)';
                label.style.transform = 'translateY(-3px)';
            } else {
                label.style.borderColor = 'transparent';
                label.style.transform = 'translateY(0)';
            }
            updateTotal();
        });
    });
};

// Contact Form Validation
const initContactForm = () => {
    const form = document.querySelector('#contact-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        const label = input.previousElementSibling;
        if (label && label.tagName === 'LABEL') {
            input.addEventListener('focus', () => {
                label.classList.add('active');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    label.classList.remove('active');
                }
            });
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate form
        let isValid = true;
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });

        if (isValid) {
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Simulate form submission
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                form.reset();
                setTimeout(() => {
                    submitBtn.innerHTML = 'Send Message';
                }, 2000);
            }, 1500);
        }
    });
};

// Booking Modal
const createBookingModal = () => {
    const modal = document.createElement('div');
    modal.className = 'booking-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Book Your Appointment</h2>
            <div class="booking-progress">
                <div class="progress-step active" data-step="1">Services</div>
                <div class="progress-step" data-step="2">Details</div>
                <div class="progress-step" data-step="3">Confirmation</div>
            </div>
            <div class="booking-steps">
                <div class="booking-step active" data-step="1">
                    <h3>Selected Services</h3>
                    <div class="selected-services-summary"></div>
                    <div class="total-summary"></div>
                    <button class="btn btn-primary next-step">Continue</button>
                </div>
                <div class="booking-step" data-step="2">
                    <form id="booking-form" class="booking-form">
                        <div class="form-grid">
                            <div class="form-group">
                                <input type="text" id="firstName" name="firstName" placeholder=" " required>
                                <label for="firstName">First Name</label>
                            </div>
                            <div class="form-group">
                                <input type="text" id="lastName" name="lastName" placeholder=" " required>
                                <label for="lastName">Last Name</label>
                            </div>
                            <div class="form-group">
                                <input type="email" id="email" name="email" placeholder=" " required>
                                <label for="email">Email</label>
                            </div>
                            <div class="form-group">
                                <input type="tel" id="phone" name="phone" placeholder=" " required>
                                <label for="phone">Phone</label>
                            </div>
                            <div class="form-group">
                                <input type="text" id="vehicleMake" name="vehicleMake" placeholder=" " required>
                                <label for="vehicleMake">Vehicle Make</label>
                            </div>
                            <div class="form-group">
                                <input type="text" id="vehicleModel" name="vehicleModel" placeholder=" " required>
                                <label for="vehicleModel">Vehicle Model</label>
                            </div>
                            <div class="form-group">
                                <input type="date" id="appointmentDate" name="appointmentDate" required>
                                <label for="appointmentDate">Preferred Date</label>
                            </div>
                            <div class="form-group">
                                <select id="appointmentTime" name="appointmentTime" required>
                                    <option value="" disabled selected>Choose a time</option>
                                </select>
                                <label for="appointmentTime">Preferred Time</label>
                            </div>
                            <div class="form-group full">
                                <textarea id="notes" name="notes" rows="4" placeholder=" "></textarea>
                                <label for="notes">Additional Notes</label>
                            </div>
                        </div>
                        <div class="button-group">
                            <button type="button" class="btn btn-secondary prev-step">Back</button>
                            <button type="submit" class="btn btn-primary">Book Appointment</button>
                        </div>
                    </form>
                </div>
                <div class="booking-step" data-step="3">
                    <div class="confirmation-message">
                        <i class="fas fa-check-circle"></i>
                        <h3>Booking Confirmed!</h3>
                        <p>Thank you for choosing Prestige Detail. You will receive a confirmation email shortly.</p>
                        <div class="booking-details"></div>
                        <button class="btn btn-primary close-modal">Done</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    return modal;
};

// Initialize booking functionality
const initBooking = () => {
    const modal = createBookingModal();
    const closeButtons = modal.querySelectorAll('.close-modal');
    const nextButtons = modal.querySelectorAll('.next-step');
    const prevButtons = modal.querySelectorAll('.prev-step');
    const bookingForm = modal.querySelector('#booking-form');
    const dateInput = modal.querySelector('#appointmentDate');
    const timeSelect = modal.querySelector('#appointmentTime');

    // Show modal with selected services
    const showBookingModal = (selectedServices, totalPrice) => {
        const summaryDiv = modal.querySelector('.selected-services-summary');
        const totalDiv = modal.querySelector('.total-summary');

        summaryDiv.innerHTML = selectedServices.map(service => `
            <div class="service-summary-item">
                <span>${service.name}</span>
                <span>$${service.price}</span>
            </div>
        `).join('');

        totalDiv.innerHTML = `
            <div class="total-price">
                <span>Total:</span>
                <span>$${totalPrice}</span>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // Handle date selection
    dateInput.addEventListener('change', async () => {
        const date = dateInput.value;
        try {
            const response = await fetch(`/api/available-times?date=${date}`);
            const availableTimes = await response.json();
            
            timeSelect.innerHTML = '<option value="">Select time...</option>' +
                availableTimes.map(time => `
                    <option value="${time}">${time}</option>
                `).join('');
        } catch (error) {
            console.error('Error fetching available times:', error);
        }
    });

    // Handle form submission
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = bookingForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        const formData = new FormData(bookingForm);
        const selectedServices = Array.from(document.querySelectorAll('.calculator-options input:checked')).map(input => ({
            name: input.closest('label').querySelector('.service-name div div:first-child').textContent,
            price: parseFloat(input.dataset.price)
        }));

        const bookingData = {
            ...Object.fromEntries(formData),
            selectedServices,
            totalPrice: selectedServices.reduce((sum, service) => sum + service.price, 0)
        };

        try {
            const response = await fetch('/api/book-appointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookingData)
            });

            const result = await response.json();

            if (result.success) {
                // Show confirmation step
                const steps = modal.querySelectorAll('.booking-step');
                const progressSteps = modal.querySelectorAll('.progress-step');
                
                steps.forEach(step => step.classList.remove('active'));
                progressSteps.forEach(step => step.classList.remove('active'));
                
                modal.querySelector('.booking-step[data-step="3"]').classList.add('active');
                modal.querySelector('.progress-step[data-step="3"]').classList.add('active');

                // Display booking details in confirmation
                const detailsDiv = modal.querySelector('.booking-details');
                detailsDiv.innerHTML = `
                    <div class="confirmation-details">
                        <p><strong>Appointment:</strong> ${bookingData.appointmentDate} at ${bookingData.appointmentTime}</p>
                        <p><strong>Services:</strong> ${selectedServices.map(s => s.name).join(', ')}</p>
                        <p><strong>Total:</strong> $${bookingData.totalPrice}</p>
                    </div>
                `;
            } else {
                throw new Error(result.error || 'Booking failed');
            }
        } catch (error) {
            console.error('Booking error:', error);
            showNotification('Failed to process booking. Please try again.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Book Appointment';
        }
    });

    // Navigation between steps
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentStep = button.closest('.booking-step');
            const nextStep = currentStep.nextElementSibling;
            const currentProgress = modal.querySelector(`.progress-step[data-step="${currentStep.dataset.step}"]`);
            const nextProgress = modal.querySelector(`.progress-step[data-step="${nextStep.dataset.step}"]`);

            currentStep.classList.remove('active');
            nextStep.classList.add('active');
            currentProgress.classList.remove('active');
            nextProgress.classList.add('active');
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentStep = button.closest('.booking-step');
            const prevStep = currentStep.previousElementSibling;
            const currentProgress = modal.querySelector(`.progress-step[data-step="${currentStep.dataset.step}"]`);
            const prevProgress = modal.querySelector(`.progress-step[data-step="${prevStep.dataset.step}"]`);

            currentStep.classList.remove('active');
            prevStep.classList.add('active');
            currentProgress.classList.remove('active');
            prevProgress.classList.add('active');
        });
    });

    // Close modal
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            // Reset form and steps
            bookingForm.reset();
            const steps = modal.querySelectorAll('.booking-step');
            const progressSteps = modal.querySelectorAll('.progress-step');
            steps.forEach(step => step.classList.remove('active'));
            progressSteps.forEach(step => step.classList.remove('active'));
            steps[0].classList.add('active');
            progressSteps[0].classList.add('active');
        });
    });

    // Update calculator to open booking modal
    const updateCalculator = () => {
        const calculator = document.querySelector('.pricing-calculator');
        if (!calculator) return;

        const total = document.querySelector('.total');
        const bookButton = document.createElement('button');
        bookButton.className = 'btn btn-primary book-now';
        bookButton.innerHTML = 'Book Now';
        total.appendChild(bookButton);

        bookButton.addEventListener('click', () => {
            const selectedServices = Array.from(document.querySelectorAll('.calculator-options input:checked')).map(input => ({
                name: input.closest('label').querySelector('.service-name div div:first-child').textContent,
                price: parseFloat(input.dataset.price)
            }));

            const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);

            if (selectedServices.length === 0) {
                showNotification('Please select at least one service', 'error');
                return;
            }

            showBookingModal(selectedServices, totalPrice);
        });
    };

    updateCalculator();
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createScrollProgress();
    initNavigation();
    initServiceCards();
    initPricingCalculator();
    initContactForm();
    initBooking();
    
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
});
