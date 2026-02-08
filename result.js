document.addEventListener('DOMContentLoaded', () => {
    // Get stored data
    const yourName = localStorage.getItem('crushMatch_yourName') || 'You';
    const crushName = localStorage.getItem('crushMatch_crushName') || 'Crush';
    const answers = JSON.parse(localStorage.getItem('crushMatch_answers') || '{}');

    // DOM Elements - Updated for New UI
    const yourNameDisplay = document.getElementById('your-name-display');
    const crushNameDisplay = document.getElementById('crush-name-display');
    const scoreNumber = document.getElementById('score-number');
    const resultMessage = document.getElementById('result-message'); // Insight Text
    const insightTitle = document.getElementById('insight-title'); // Insight Headline
    const retryBtn = document.getElementById('retry-btn');
    const shareBtn = document.getElementById('share-btn');

    // Set Names if elements exist
    if (yourNameDisplay) yourNameDisplay.textContent = yourName;
    if (crushNameDisplay) crushNameDisplay.textContent = crushName;

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

    // Update Text Content
    if (resultMessage) resultMessage.textContent = message;
    
    // Dynamic Insight Title based on Score
    if (insightTitle) {
        if (matchPercentage >= 85) insightTitle.textContent = "Your vibes are immaculate. ✨";
        else if (matchPercentage >= 70) insightTitle.textContent = "Definitely some chemistry here. 🧪";
        else if (matchPercentage >= 50) insightTitle.textContent = "Potential is definitely there. 🌱";
        else insightTitle.textContent = "It’s complicated, but possible. 🤔";
    }

    // --- ANIMATION LOGIC ---

    // 1. Helper to animate any circle
    function animateCircle(circleId, labelId, targetVal) {
        const circle = document.getElementById(circleId);
        const label = document.getElementById(labelId);
        
        // Safety check
        if (!label) return;
        if (!circle) {
            // Just animate number if circle is missing
            let current = 0;
            const interval = setInterval(() => {
                if (current >= targetVal) {
                    current = targetVal;
                    clearInterval(interval);
                }
                label.textContent = current + "%";
                current++;
            }, 10);
            return;
        }

        // SVG Circle Logic (r=45, circumference ≈ 283)
        // Matches CSS: stroke-dasharray: 283
        const radius = 45;
        const circumference = 2 * Math.PI * radius;
        
        // Reset to empty
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;

        setTimeout(() => {
            const offset = circumference - (targetVal / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        }, 300);

        // Animate Number
        let current = 0;
        let stepTime = 1500 / (targetVal || 1); 
        if (targetVal === 0) stepTime = 10;

        const interval = setInterval(() => {
            if (current >= targetVal) {
                current = targetVal;
                clearInterval(interval);
            }
            label.textContent = current + "%";
            if (current < targetVal) current++;
        }, stepTime);
    }

    // 2. Generate Simulated Breakdown Scores
    function fuzzyScore(base, variance) {
        let val = base + (Math.random() * variance * 2 - variance);
        return Math.min(100, Math.max(10, Math.floor(val)));
    }

    const romanceScore = fuzzyScore(matchPercentage, 10);
    const commScore = fuzzyScore(matchPercentage, 15);
    const lifeScore = fuzzyScore(matchPercentage, 8);

    // 3. Trigger Animations
    if (scoreNumber) {
        setTimeout(() => {
            // Main Huge Score
            let mainCurrent = 0;
            const mainInterval = setInterval(() => {
                if (mainCurrent >= matchPercentage) {
                    mainCurrent = matchPercentage;
                    clearInterval(mainInterval);
                    launchConfetti();
                }
                scoreNumber.textContent = mainCurrent;
                if (mainCurrent < matchPercentage) mainCurrent++;
            }, 15);

            // Sub-scores
            animateCircle('romance-circle', 'romance-val', romanceScore);
            animateCircle('comm-circle', 'comm-val', commScore);
            animateCircle('life-circle', 'life-val', lifeScore);

        }, 300);
    }

    // Button Handlers
    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'index.html';
        });
    }

    if (shareBtn) {
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
    }

    // Confetti Effect
    function launchConfetti() {
        const colors = ['#ff69b4', '#9370db', '#87cefa', '#ffd700', '#ff1493'];
        const confettiContainer = document.getElementById('confetti-container');
        if (!confettiContainer) return;
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            
            // Random properties
            const left = Math.random() * 95 + 'vw';
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
            setTimeout(() => confetti.remove(), 4000);
        }
    }
});
