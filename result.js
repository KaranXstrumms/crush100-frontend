document.addEventListener('DOMContentLoaded', () => {
    // Get stored data
    const yourName = localStorage.getItem('crushMatch_yourName') || 'You';
    const crushName = localStorage.getItem('crushMatch_crushName') || 'Crush';
    const answers = JSON.parse(localStorage.getItem('crushMatch_answers') || '{}');

    // DOM Elements
    const yourNameDisplay = document.getElementById('your-name-display');
    const crushNameDisplay = document.getElementById('crush-name-display');
    const scoreNumber = document.getElementById('score-number');
    const circle = document.querySelector('.progress-ring__circle');
    const resultMessage = document.getElementById('result-message');
    const retryBtn = document.getElementById('retry-btn');
    const shareBtn = document.getElementById('share-btn');

    // Set Names
    yourNameDisplay.textContent = yourName;
    crushNameDisplay.textContent = crushName;

    // Check Welcome Back
    if (localStorage.getItem('crushMatch_welcomeBack') === 'true') {
        const title = document.querySelector('.title');
        const subtitle = document.querySelector('.subtitle');
        if (subtitle) {
            subtitle.innerHTML = `Welcome back 💕 We remembered your last match.`;
            subtitle.style.color = '#e91e63';
            subtitle.style.fontWeight = '700';
            // Clean up flag so it doesn't persist on refresh forever
            localStorage.removeItem('crushMatch_welcomeBack');
        }
    }

    // Check for backend result
    const backendResult = JSON.parse(localStorage.getItem('crushMatch_result') || 'null');
    
    let matchPercentage = 0;
    let message = "";

    if (backendResult && backendResult.percentage) {
        matchPercentage = backendResult.percentage;
        message = backendResult.message;
    } else {
        // Fallback: Calculate locally if no backend result (Offline mode)
        const combined = yourName.toLowerCase() + crushName.toLowerCase();
        let hash = 0;
        for (let i = 0; i < combined.length; i++) {
            hash = combined.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        const answerBoost = Object.values(answers).filter(a => a === 'Yes').length * 5;
        
        matchPercentage = (Math.abs(hash) % 41) + 50 + answerBoost; 
        if (matchPercentage > 100) matchPercentage = 100;

        // Determine Message Locally
        if (matchPercentage >= 90) {
            message = "Soulmates! It’s meant to be! 💍";
        } else if (matchPercentage >= 75) {
            message = "Strong chances, but take it slow 😉";
        } else if (matchPercentage >= 60) {
            message = "There’s a spark… don’t ignore it 💫";
        } else if (matchPercentage >= 40) {
            message = "Cute connection, timing matters 💕";
        } else {
            message = "Friends for now, maybe more later? 🤷‍♂️";
        }
    }

    // Animation Logic
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;

    function setProgress(percent) {
        const offset = circumference - (percent / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }

    // Trigger Animations after load
    setTimeout(() => {
        // Animate Number
        let currentScore = 0;
        const interval = setInterval(() => {
            if (currentScore >= matchPercentage) {
                clearInterval(interval);
                resultMessage.innerText = message;
                resultMessage.classList.add('page-enter'); // Fade in message
                launchConfetti();
            } else {
                currentScore++;
                scoreNumber.innerText = currentScore;
            }
        }, 15);

        // Animate Ring
        setProgress(matchPercentage);

    }, 300);


    // Button Handlers
    retryBtn.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'index.html';
    });

    shareBtn.addEventListener('click', () => {
        const text = `I matched ${matchPercentage}% with my crush on CrushMatch! 💖 Check yours now!`;
        if (navigator.share) {
            navigator.share({
                title: 'CrushMatch Result',
                text: text,
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback
            alert("Result copied to clipboard: " + text);
            navigator.clipboard.writeText(text);
        }
    });

    // Confetti Effect
    function launchConfetti() {
        const colors = ['#ff69b4', '#9370db', '#87cefa', '#ffd700', '#ff1493'];
        const confettiContainer = document.getElementById('confetti-container');
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            
            // Random properties
            const left = Math.random() * 100 + 'vw';
            const animDuration = Math.random() * 3 + 2 + 's';
            const bg = colors[Math.floor(Math.random() * colors.length)];
            
            confetti.style.left = left;
            confetti.style.backgroundColor = bg;
            confetti.style.top = '-10px';
            
            // Create Animation
            confetti.animate([
                { transform: `translate3d(0,0,0) rotateX(0) rotateY(0)`, opacity: 1 },
                { transform: `translate3d(${Math.random()*100 - 50}px, 100vh, 0) rotateX(${Math.random()*360}deg) rotateY(${Math.random()*360}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 2000 + 1500,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fill: 'forwards'
            });

            confettiContainer.appendChild(confetti);
            
            // Cleanup
            setTimeout(() => confetti.remove(), 4000);
        }
    }
});
