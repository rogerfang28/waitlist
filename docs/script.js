// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show loading state
function showLoading(button) {
    const originalContent = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Joining...';
    button.disabled = true;
    return originalContent;
}

// Show success message
function showSuccess(formArea) {
    formArea.innerHTML = `
        <div class="success-message">
            <i class="fas fa-check-circle"></i>
            <h3>Welcome to the Waitlist! 🎉</h3>
            <p>Thank you for joining! We'll notify you as soon as DebateLogic is ready.</p>
            <p><small>Check your email for confirmation details.</small></p>
        </div>
    `;
}

// Show error message
function showError(message, emailInput, button, originalContent) {
    button.innerHTML = originalContent;
    button.disabled = false;
    
    // Create or update error message
    let errorDiv = document.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        emailInput.parentNode.insertBefore(errorDiv, emailInput.nextSibling);
    }
    
    errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    errorDiv.style.cssText = `
        color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        padding: 12px;
        border-radius: 8px;
        margin-top: 10px;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
    `;
    
    // Add red border to input
    emailInput.style.borderColor = '#ef4444';
    emailInput.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    
    // Remove error styling on focus
    emailInput.addEventListener('focus', function() {
        emailInput.style.borderColor = '#667eea';
        emailInput.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
        if (errorDiv) {
            errorDiv.remove();
        }
    }, { once: true });
}

// Add smooth scroll to form after page load
window.addEventListener('load', function() {
    const formArea = document.getElementById('form-area');
    if (formArea) {
        formArea.style.opacity = '0';
        formArea.style.transform = 'translateY(20px)';
        formArea.style.transition = 'all 0.8s ease';
        
        setTimeout(() => {
            formArea.style.opacity = '1';
            formArea.style.transform = 'translateY(0)';
        }, 600);
    }
});

// Main event listener
document.getElementById("join").addEventListener("click", async function() {
    console.log("Join button clicked!");
    
    const emailInput = document.getElementById("email");
    const email = emailInput.value.trim();
    const formArea = document.getElementById("form-area");
    const button = this;
    
    // Clear any existing error states
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Validation
    if (!email) {
        showError("Please enter your email address", emailInput, button, button.innerHTML);
        emailInput.focus();
        return;
    }
    
    if (!isValidEmail(email)) {
        showError("Please enter a valid email address", emailInput, button, button.innerHTML);
        emailInput.focus();
        return;
    }
    
    // Show loading state
    const originalContent = showLoading(button);
    
    try {
        // Send to backend
        const response = await fetch("https://waitlist-backend-h04k.onrender.com/join", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log("Server response:", data.message);
            
            // Add a small delay for better UX
            setTimeout(() => {
                showSuccess(formArea);
                
                // Add confetti effect (optional - using a simple animation)
                createCelebration();
            }, 800);
            
        } else {
            throw new Error(data.message || "Failed to join waitlist");
        }
        
    } catch (error) {
        console.error("Error:", error);
        
        let errorMessage = "Something went wrong. Please try again.";
        if (error.message.includes("fetch")) {
            errorMessage = "Unable to connect. Please check your internet connection.";
        } else if (error.message.includes("already")) {
            errorMessage = "This email is already on our waitlist!";
        }
        
        showError(errorMessage, emailInput, button, originalContent);
    }
});

// Simple celebration animation
function createCelebration() {
    const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'];
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -10px;
                left: ${Math.random() * 100}vw;
                z-index: 9999;
                border-radius: 50%;
                pointer-events: none;
                animation: fall 3s linear forwards;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 100);
    }
}

// Add CSS for confetti animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add keyboard support
document.getElementById("email").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("join").click();
    }
});

// Add focus animation to email input
document.getElementById("email").addEventListener("focus", function() {
    this.parentNode.style.transform = "scale(1.02)";
    this.parentNode.style.transition = "transform 0.2s ease";
});

document.getElementById("email").addEventListener("blur", function() {
    this.parentNode.style.transform = "scale(1)";
});