// js/validation.js - Form Validation
document.addEventListener('DOMContentLoaded', function() {
    initFormValidation();
});

function initFormValidation() {
    const form = document.querySelector('form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const inputs = form.querySelectorAll('input, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            const errorElement = input.parentElement?.querySelector('.error-message') || 
                                document.getElementById(`${input.id}-error`);
            
            // Remove previous error state
            input.classList.remove('error');
            if (errorElement) errorElement.style.display = 'none';
            
            // Validate
            if (input.hasAttribute('required') && !input.value.trim()) {
                showError(input, 'This field is required');
                isValid = false;
                return;
            }
            
            if (input.type === 'email' && input.value.trim()) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(input.value.trim())) {
                    showError(input, 'Please enter a valid email address');
                    isValid = false;
                    return;
                }
            }
            
            if (input.type === 'tel' && input.value.trim()) {
                const phonePattern = /^[\+\d\s\-\(\)]{10,15}$/;
                if (!phonePattern.test(input.value.trim())) {
                    showError(input, 'Please enter a valid phone number');
                    isValid = false;
                    return;
                }
            }
        });
        
        if (isValid) {
            // Simulate form submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn?.textContent || 'Submit';
            
            if (submitBtn) {
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
            }
            
            setTimeout(() => {
                alert('Thank you! Your message has been sent successfully.');
                form.reset();
                if (submitBtn) {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }, 1500);
        }
    });
    
    // Real-time validation on blur
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() && this.hasAttribute('required')) {
                // Remove error if field is filled
                this.classList.remove('error');
                const errorElement = this.parentElement?.querySelector('.error-message') || 
                                    document.getElementById(`${this.id}-error`);
                if (errorElement) errorElement.style.display = 'none';
            }
        });
        
        // Real-time email validation
        if (input.type === 'email') {
            input.addEventListener('input', function() {
                if (this.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value.trim())) {
                    this.classList.add('error');
                } else {
                    this.classList.remove('error');
                }
            });
        }
    });
}

function showError(input, message) {
    input.classList.add('error');
    
    const errorElement = input.parentElement?.querySelector('.error-message') || 
                        document.getElementById(`${input.id}-error`);
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}