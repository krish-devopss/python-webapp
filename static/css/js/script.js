// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    checkHealth();
    fetchNewQuote();
    updateServerTime();
    
    // Update time every second
    setInterval(updateServerTime, 1000);
    setInterval(checkHealth, 30000); // Check every 30 seconds
});

// Check server health
async function checkHealth() {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        
        const statusBadge = document.getElementById('statusBadge');
        const serverStatus = document.getElementById('serverStatus');
        
        if (data.status === 'healthy') {
            statusBadge.innerHTML = '<span class="dot"></span> Connected ✅';
            if (serverStatus) serverStatus.textContent = 'Online';
            statusBadge.style.background = 'rgba(74, 222, 128, 0.2)';
        } else {
            throw new Error('Server not healthy');
        }
    } catch (error) {
        console.error('Health check failed:', error);
        const statusBadge = document.getElementById('statusBadge');
        statusBadge.innerHTML = '<span class="dot" style="background: #ef4444;"></span> Offline ❌';
        const serverStatus = document.getElementById('serverStatus');
        if (serverStatus) serverStatus.textContent = 'Offline';
    }
}

// Fetch new quote
async function fetchNewQuote() {
    const quoteElement = document.getElementById('quoteText');
    const timeElement = document.getElementById('quoteTime');
    
    quoteElement.textContent = 'Loading...';
    
    try {
        const response = await fetch('/api/quote');
        const data = await response.json();
        
        quoteElement.textContent = `"${data.quote}"`;
        timeElement.textContent = `✨ Updated at ${data.time}`;
        
        // Add animation
        quoteElement.style.animation = 'none';
        quoteElement.offsetHeight; // Trigger reflow
        quoteElement.style.animation = 'fadeInUp 0.5s ease';
    } catch (error) {
        console.error('Failed to fetch quote:', error);
        quoteElement.textContent = '✨ Stay inspired! Keep coding! ✨';
    }
}

// Send message
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) {
        showMessageResponse('Please enter a message! 💫', 'error');
        return;
    }
    
    const responseDiv = document.getElementById('messageResponse');
    responseDiv.classList.remove('hidden');
    responseDiv.innerHTML = 'Sending... 🤔';
    
    try {
        const response = await fetch('/api/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });
        
        const data = await response.json();
        showMessageResponse(data.reply, 'success');
        input.value = ''; // Clear input
        
        // Clear after 5 seconds
        setTimeout(() => {
            responseDiv.classList.add('hidden');
        }, 5000);
    } catch (error) {
        console.error('Failed to send message:', error);
        showMessageResponse('Failed to send message. Please try again! 🔄', 'error');
    }
}

// Show message response
function showMessageResponse(message, type) {
    const responseDiv = document.getElementById('messageResponse');
    responseDiv.innerHTML = message;
    responseDiv.style.background = type === 'success' ? '#f0fdf4' : '#fef2f2';
    responseDiv.style.borderLeftColor = type === 'success' ? '#4ade80' : '#ef4444';
}

// Update server time
function updateServerTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
    
    const serverTimeElement = document.getElementById('serverTime');
    if (serverTimeElement) {
        serverTimeElement.textContent = timeString;
    }
}

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Console welcome message
console.log('%c✨ Python Flask App Loaded Successfully! ✨', 'color: #667eea; font-size: 16px; font-weight: bold;');
console.log('%cInteractive features are ready to use!', 'color: #764ba2; font-size: 12px;');
