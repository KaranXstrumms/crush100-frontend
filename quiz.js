document.addEventListener('DOMContentLoaded', () => {
    // Determine user and crush names from local storage, or use defaults
    const crushName = localStorage.getItem('crushMatch_crushName') || 'your crush';
    
    // Quiz State
    let currentQuestionIndex = 0;
    const answers = {};
    const QUESTIONS_PER_SESSION = 10;
    
    // NEW Crush-Centric Question Pool (30 Questions)
    const questionPool = [
        // ENCOUNTERS / EYE CONTACT
        { id: 1, category: "Vibe", question: "When you walk into a room, do they look up at you?", options: ["Almost always", "Sometimes", "Rarely"] },
        { id: 2, category: "Vibe", question: "Have you ever caught them staring at you?", options: ["Yes, intense eye contact!", "Maybe once or twice", "No, never"] },
        { id: 3, category: "Vibe", question: "When you talk, do they maintain eye contact?", options: ["Yes, locked in", "They look away shyly", "They seem distracted"] },
        { id: 4, category: "Vibe", question: "Do you catch them smiling when they see you?", options: ["Yes, a genuine smile", "A polite smile", "Neutral expression"] },
        { id: 5, category: "Vibe", question: "Have you noticed any 'accidental' touches?", options: ["Yes, knees/arms brush often", "Once or twice", "Never happened"] },
        
        // INTERACTION
        { id: 6, category: "Interaction", question: "How often do you two actually talk?", options: ["Daily / Almost daily", "Weekly / Occasional", "Rarely / Never"] },
        { id: 7, category: "Interaction", question: "Who usually starts the conversation?", options: ["They do", "I do", "It's 50/50"] },
        { id: 8, category: "Interaction", question: "Do they remember small details you told them?", options: ["Yes, surprisingly well!", "Sometimes", "No, they forget"] },
        { id: 9, category: "Interaction", question: "When you're with friends, do they act differently around you?", options: ["Yes, nicer/quieter", "No difference", "They ignore me"] },
        { id: 10, category: "Interaction", question: "Do they ask you questions about your life?", options: ["Yes, personal ones", "Standard polite stuff", "Not really"] },
        
        // SOCIAL MEDIA / DIGITAL
        { id: 11, category: "Digital", question: "If you post a story, do they view it quickly?", options: ["Usually very fast", "Sometimes", "They rarely view it"] },
        { id: 12, category: "Digital", question: "Do they like or reply to your posts?", options: ["Often!", "Occasionally", "Never"] },
        { id: 13, category: "Digital", question: "Have you ever DM'd each other?", options: ["Constant chatting", "A few times", "Never"] },
        { id: 14, category: "Digital", question: "Are you in their 'Close Friends' list?", options: ["Yes!", "I suspect so", "No / Don't know"] },
        
        // SOCIAL CONTEXT / FRIENDS
        { id: 15, category: "Social", question: "Do your friends think they like you?", options: ["Yes, they're convinced", "They're unsure", "My friends haven't noticed"] },
        { id: 16, category: "Social", question: "Have their friends ever teased them about you?", options: ["Yes, I noticed giggling", "Maybe", "No"] },
        { id: 17, category: "Social", question: "Do you have mutual friends?", options: ["Yes, several", "One or two", "No"] },
        { id: 18, category: "Social", question: "Have you hung out one-on-one?", options: ["Yes, intentional hangouts", "Only accidentally", "Never"] },
        
        // EMOTIONAL / INTUITION
        { id: 19, category: "Intuition", question: "Does it feel like there's 'tension' between you?", options: ["Yes, electric tension", "Maybe a little", "No, just friendly"] },
        { id: 20, category: "Intuition", question: "Do you get nervous butterflies around them?", options: ["Yes, intense butterflies", "A little excitement", "I feel calm"] },
        { id: 21, category: "Intuition", question: "Do they seem nervous around you?", options: ["Yes, fidgety/shy", "Confident/Cool", "Indifferent"] },
        { id: 22, category: "Intuition", question: "Do you feel like they 'get' your jokes?", options: ["Yes, they laugh the most", "Polite laughter", "They don't really react"] },
        
        // SCENARIOS
        { id: 23, category: "Scenario", question: "If you needed help, would they offer?", options: ["Immediately", "If asked", "Probably not"] },
        { id: 24, category: "Scenario", question: "Have they ever complimented you?", options: ["Yes, on appearances/personality", "Generic compliments", "Never"] },
        { id: 25, category: "Scenario", question: "Do they try to be near you in a group?", options: ["Yes, they gravitate to me", "Sometimes", "No preference"] },
        { id: 26, category: "Scenario", question: "Have you ever shared a secret?", options: ["Yes, deep secrets", "Small personal things", "No"] },
        { id: 27, category: "Scenario", question: "Do they notice when you change your appearance?", options: ["Yes, they comment on it", "Maybe they notice", "No"] },
        
        // WILD CARDS
        { id: 28, category: "Wild", question: "Do you share similar music or movie tastes?", options: ["Scary good match", "Some overlap", "Completely different"] },
        { id: 29, category: "Wild", question: "Are they currently single?", options: ["Yes, definitely", "It's complicated", "No / Don't know"] },
        { id: 30, category: "Wild", question: "Does your gut tell you they like you?", options: ["YES!", "I'm confused", "Probably not"] }
    ];

    // Select Random Questions
    function shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    const questions = shuffle([...questionPool]).slice(0, QUESTIONS_PER_SESSION);

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
        currentStepDisplay.innerText = `${index + 1}/${QUESTIONS_PER_SESSION}`;
        progressBar.style.width = `${((index + 1) / QUESTIONS_PER_SESSION) * 100}%`;
        
        // Animate Out old content if needed
        questionContainer.classList.remove('fade-in');
        void questionContainer.offsetWidth; // Trigger reflow
        questionContainer.classList.add('fade-in');

        questionText.innerText = question.question || question.text;
        
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
            nextBtn.innerText = "See Compatibility 💖";
        } else {
            nextBtn.innerText = "Next Question →";
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
        if (nextBtn.disabled) return;

        if (currentQuestionIndex < questions.length - 1) {
            // Animate transition (simple opacity fade if css supports it, otherwise prompt)
            nextBtn.disabled = true;
            setTimeout(() => {
                currentQuestionIndex++;
                loadQuestion(currentQuestionIndex);
            }, 200);
        } else {
            // Finish Quiz & Call API
            nextBtn.innerText = "Analyzing Vibe... 🔮";
            nextBtn.disabled = true;
            nextBtn.style.opacity = "0.8";

            const userName = localStorage.getItem('crushMatch_yourName');
            const crushName = localStorage.getItem('crushMatch_crushName');
            
            // Prepare payload
            const payload = {
                userName: userName,
                crushName: crushName,
                answersCrush: answers,
                answersUser: {} 
            };

            // Using dummy API call logic as framework allows
            // Simulate API delay for UX
            setTimeout(() => {
                 // Fallback to offline mode logic (since backend might not exist or be connected properly yet)
                 saveAndRedirect(answers);
            }, 1500);
        }
    });

    function saveAndRedirect(finalAnswers) {
        // Mock result generation if API fails or is simulated
        // In a real app, this would come from the backend response
        const mockResult = {
             success: true,
             data: {
                 percentage: 85, // Will be calculated in result.js based on hash if null
                 message: "Premium Logic Applied"
             }
        };

        localStorage.setItem('crushMatch_answers', JSON.stringify(finalAnswers));
        
        // Clear old result to force recalculation or keep it if valid
        localStorage.removeItem('crushMatch_result');

        window.location.href = 'result.html';
    }
});
