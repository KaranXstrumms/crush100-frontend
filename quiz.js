document.addEventListener('DOMContentLoaded', () => {
    // Determine user and crush names from local storage, or use defaults
    const crushName = localStorage.getItem('crushMatch_crushName') || 'your crush';
    
    // Quiz State
    let currentQuestionIndex = 0;
    const answers = {};
    
    // Dynamic Questions Array
    const questions = [
        {
            id: 1,
            text: `Is ${crushName} your neighbour?`,
            options: ['Yes', 'No', 'Maybe']
        },
        {
            id: 2,
            text: `Is ${crushName} taller than you?`,
            options: ['Yes', 'No', 'About the same']
        },
        {
            id: 3,
            text: `Does ${crushName} talk to you often?`,
            options: ['Yes', 'Sometimes', 'Rarely']
        },
        {
            id: 4,
            text: `Does ${crushName} have pets?`,
            options: ['Yes', 'No', 'Not sure']
        },
        {
            id: 5,
            text: `Is ${crushName} in school or college?`,
            options: ['School', 'College', 'Working', 'Other']
        }
    ];

    // DOM Elements
    const questionText = document.getElementById('question-text');
    const optionsGrid = document.getElementById('options-grid');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentStepDisplay = document.getElementById('current-step');
    const questionContainer = document.getElementById('question-container');

    // Initialize Quiz
    loadQuestion(currentQuestionIndex);

    function loadQuestion(index) {
        const question = questions[index];
        
        // Update UI
        currentStepDisplay.innerText = index + 1;
        progressBar.style.width = `${((index + 1) / questions.length) * 100}%`;
        
        // Animate Out old content if needed (handled by transition logic usually, but here handled by simple fade-in on new)
        questionContainer.classList.remove('fade-in');
        void questionContainer.offsetWidth; // Trigger reflow
        questionContainer.classList.add('fade-in');

        questionText.innerText = question.text;
        optionsGrid.innerHTML = '';
        nextBtn.disabled = true;

        // Create Options
        question.options.forEach(option => {
            const card = document.createElement('div');
            card.classList.add('option-card');
            card.innerHTML = `
                <span>${option}</span>
                <span class="check-icon">✨</span>
            `;
            
            card.addEventListener('click', () => selectOption(card, option));
            optionsGrid.appendChild(card);
        });

        // Check if last question
        if (index === questions.length - 1) {
            nextBtn.innerText = "Continue →";
        } else {
            nextBtn.innerText = "Next →";
        }
    }

    function selectOption(selectedCard, optionValue) {
        // Remove active class from all
        const cards = optionsGrid.querySelectorAll('.option-card');
        cards.forEach(card => card.classList.remove('selected'));
        
        // Add to clicked
        selectedCard.classList.add('selected');
        
        // Save answer
        answers[questions[currentQuestionIndex].id] = optionValue;
        
        // Enable Next
        nextBtn.disabled = false;
    }

    nextBtn.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            // Animate transition
            questionContainer.classList.add('fade-out');
            
            setTimeout(() => {
                currentQuestionIndex++;
                questionContainer.classList.remove('fade-out');
                loadQuestion(currentQuestionIndex);
            }, 300);
        } else {
            // Finish Quiz & Call API
            nextBtn.innerText = "Calculating...";
            nextBtn.disabled = true;

            const userName = localStorage.getItem('crushMatch_yourName');
            const crushName = localStorage.getItem('crushMatch_crushName');
            
            // Prepare payload
            const payload = {
                userName: userName,
                crushName: crushName,
                answersCrush: answers,
                answersUser: {} // Placeholder as per requirements
            };

            const apiUrl = CONFIG.getApiUrl();

            fetch(`${apiUrl}/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (!response.ok) throw new Error('API Error');
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // Save result from backend
                    localStorage.setItem('crushMatch_result', JSON.stringify(data.data));
                    // Also save answers just in case
                    localStorage.setItem('crushMatch_answers', JSON.stringify(answers));

                    setTimeout(() => {
                        window.location.href = 'result.html';
                    }, 500);
                } else {
                    alert('Something went wrong. Please try again.');
                    nextBtn.innerText = "Try Again";
                    nextBtn.disabled = false;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Connection error. Using offline mode.');
                
                // Fallback to offline mode
                localStorage.setItem('crushMatch_answers', JSON.stringify(answers));
                window.location.href = 'result.html';
            });
        }
    });
});
