document.addEventListener('DOMContentLoaded', () => {
    const yourNameInput = document.getElementById('your-name');
    const crushNameInput = document.getElementById('crush-name');
    const nextBtn = document.getElementById('next-btn');
    const form = document.getElementById('details-form');

    function checkInputs() {
        const yourName = yourNameInput.value.trim();
        const crushName = crushNameInput.value.trim();
        
        if (yourName && crushName) {
            nextBtn.disabled = false;
        } else {
            nextBtn.disabled = true;
        }
    }

    yourNameInput.addEventListener('input', checkInputs);
    crushNameInput.addEventListener('input', checkInputs);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (nextBtn.disabled) return;

        const yourName = yourNameInput.value.trim();
        const crushName = crushNameInput.value.trim();

        // Save to local storage for the next step
        localStorage.setItem('crushMatch_yourName', yourName);
        localStorage.setItem('crushMatch_crushName', crushName);

        // Add visual feedback
        nextBtn.innerHTML = "Checking history... 💖";
        nextBtn.disabled = true;
        
        const apiUrl = CONFIG.getApiUrl();

        // Check if this pair already exists
        fetch(`${apiUrl}/matches/check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName: yourName, crushName: crushName })
        })
        .then(res => {
            if (res.ok) return res.json();
            throw new Error('Not found or error');
        })
        .then(data => {
            if (data.success && data.data) {
                // Match found! Skip quiz
                localStorage.setItem('crushMatch_result', JSON.stringify(data.data));
                localStorage.setItem('crushMatch_welcomeBack', 'true');
                
                setTimeout(() => {
                    window.location.href = 'result.html';
                }, 800);
            } else {
                throw new Error('No match data');
            }
        })
        .catch(() => {
            // No match found or error -> Proceed to Quiz
            localStorage.removeItem('crushMatch_welcomeBack'); // Clear flag
            setTimeout(() => {
                window.location.href = 'quiz.html';
            }, 800);
        });
    });
});
