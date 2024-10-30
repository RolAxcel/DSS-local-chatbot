const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

let step = 0; 
let budget = 0;
let category = '';
let brand = '';
let isHandlingGeneralQuestion = false;

const productSpecs = {
    laptop: {
        name: 'Gaming Laptop',
        brand: 'MSI',
        specs: 'Intel Core i7, 16GB RAM, NVIDIA RTX 3060, 1TB SSD, 144Hz Display',
        price: 52000
    },
    smartphone: {
        name: 'Flagship Smartphone',
        brand: 'Samsung',
        specs: 'Snapdragon 8 Gen 2, 12GB RAM, 256GB Storage, 5000mAh Battery, 120Hz AMOLED Display',
        price: 35000
    },
    tablet: {
        name: 'High-end Tablet',
        brand: 'Apple',
        specs: 'Apple M1 Chip, 8GB RAM, 128GB Storage, 12.9" Liquid Retina Display, 10-hour Battery',
        price: 45000
    }
};

const generalResponses = [
    "I'm here to help! What else would you like to know?",
    "That's interesting! Can you tell me more?",
    "I'm not sure, but I can try to find out!",
    "Sure thing! What exactly are you looking for?",
    "I can answer anything—just let me know!"
];

// Clear chatbox before loading chat history from localStorage
function loadChatHistory() {
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatbox.innerHTML = ''; // Clear chatbox to avoid duplication
    chatHistory.forEach(message => {
        addMessage(message.sender, message.text, false); // Avoid re-saving to localStorage on reload
    });
}

// Save messages to localStorage
function saveToLocalStorage(sender, text) {
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatHistory.push({ sender, text });
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

// Add a message to the chatbox and optionally save to localStorage
function addMessage(sender, text, save = true) {
    const message = document.createElement('p');
    message.className = sender;
    message.textContent = text;
    chatbox.appendChild(message);
    chatbox.scrollTop = chatbox.scrollHeight;

    if (save) saveToLocalStorage(sender, text);
}

// Display typing animation
function showTypingAnimation() {
    const typing = document.createElement('p');
    typing.className = 'bot typing';
    typing.innerHTML = 'Typing<span>.</span><span>.</span><span>.</span>';
    chatbox.appendChild(typing);
    chatbox.scrollTop = chatbox.scrollHeight;
    return typing;
}

// Handle user input when the send button is clicked
sendBtn.addEventListener('click', handleUserInput);

function handleUserInput() {
    const userText = userInput.value.trim();
    if (userText === '') return;

    addMessage('user', userText);
    userInput.value = '';

    if (isHandlingGeneralQuestion) {
        handleGeneralQuestion(userText);
    } else {
        handleProductFlow(userText);
    }
}

function handleProductFlow(userText) {
    if (step === 0) {
        budget = parseInt(userText);
        if (isNaN(budget) || budget < 0) {
            botReply("Please enter a valid budget amount in Philippine pesos (₱).");
        } else {
            botReply("Got it! Now, what product category are you interested in? (laptop, smartphone, or tablet)");
            step++;
        }
    } else if (step === 1) {
        category = userText.toLowerCase();
        if (!productSpecs[category]) {
            botReply("Sorry, I don't recognize that category. Please choose laptop, smartphone, or tablet.");
        } else {
            const brandOptions = category === 'laptop'
                ? 'HP, Apple, Dell, Acer, Asus, MSI'
                : category === 'smartphone'
                ? 'Apple, Samsung, Oppo, Xiaomi, Tecno'
                : 'Any brand!';
            botReply(`Great choice! Which ${category} brand do you prefer? (e.g., ${brandOptions})`);
            step++;
        }
    } else if (step === 2) {
        brand = userText;
        provideRecommendation(category, brand);
        step = 0;
        isHandlingGeneralQuestion = true;
    }
}

function provideRecommendation(category, brand) {
    const product = productSpecs[category];

    if (budget >= product.price) {
        botReply(
            `Based on your preference for ${brand} and a budget of ₱${budget}, I recommend the following ${category}:\n` +
            `${product.name} by ${product.brand}\n` +
            `Specs: ${product.specs}\n` +
            `Price: ₱${product.price}`
        );
    } else {
        botReply(
            `Unfortunately, the ${category} you chose exceeds your budget. Here are the specs in case you want to save for it:\n` +
            `${product.name} by ${product.brand}\n` +
            `Specs: ${product.specs}\n` +
            `Price: ₱${product.price}`
        );
    }

    setTimeout(() => {
        botReply("Is there anything else I can assist you with?");
    }, 20000);
}

function handleGeneralQuestion(userText) {
    userText = userText.toLowerCase();

    if (category === 'laptop' && userText.includes('gaming')) {
        botReply("For gaming laptops, look for at least an RTX 3050 GPU, 16GB RAM, and a 144Hz display for smooth gameplay.");
    } else if (category === 'smartphone' && userText.includes('camera')) {
        botReply("For great cameras, consider the Samsung Galaxy S23 Ultra or iPhone 15 Pro Max.");
    } else if (category === 'tablet' && userText.includes('battery')) {
        botReply("High-end tablets like the iPad Pro offer a 10-hour battery life, ideal for long use.");
    } else {
        const randomResponse = generalResponses[Math.floor(Math.random() * generalResponses.length)];
        botReply(randomResponse);
    }
}

function botReply(text) {
    const typing = showTypingAnimation();

    // Simulate typing animation delay
    setTimeout(() => {
        typing.remove();
        typeTextLetterByLetter(text);
    }, 1000);
}

function typeTextLetterByLetter(text) {
    const message = document.createElement('p');
    message.className = 'bot';
    chatbox.appendChild(message);

    let index = 0;
    const interval = setInterval(() => {
        message.textContent += text[index];
        index++;
        chatbox.scrollTop = chatbox.scrollHeight;

        if (index >= text.length) {
            clearInterval(interval);
            saveToLocalStorage('bot', text);
        }
    }, 50);
}

function resetChat() {
    localStorage.removeItem('chatHistory'); // Removes only chat history
    chatbox.innerHTML = ''; // Clear the chatbox UI
    addMessage('bot', "What Gadget are you looking for? please enter your budget in Philippine pesos (₱).");
}

// Load chat history on page load
window.addEventListener('load', loadChatHistory);
