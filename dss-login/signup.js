// Function to handle sign-up
function signup() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    if (name && email && password) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if email already exists
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            alert("This email is already registered.");
            return;
        }

        users.push({ name, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        alert("Account created successfully!");

        // Clear input fields after signup
        document.getElementById('signup-name').value = '';
        document.getElementById('signup-email').value = '';
        document.getElementById('signup-password').value = '';

        displayAccounts();  // Refresh the account list
    } else {
        alert("Please fill in all fields.");
    }
}

// Function to handle login
function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        alert(`Welcome, ${user.name}!`);
        window.location.href = "/dss-gadget/dss-AI.html";  // Redirect to DSS page
    } else {
        alert("Invalid email or password.");
    }
}

// Function to display accounts
function displayAccounts() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const accountDisplay = document.getElementById('account-display');
    accountDisplay.innerHTML = '';  // Clear previous entries

    users.forEach((user, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${user.name} (${user.email}) 
            <button onclick="deleteAccount(${index})">Delete</button>
        `;
        accountDisplay.appendChild(li);
    });
}

// Function to delete a specific account by index
function deleteAccount(index) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.splice(index, 1);  // Remove the selected account

    localStorage.setItem('users', JSON.stringify(users));
    alert("Account deleted successfully.");
    displayAccounts();  // Refresh the account list
}

// Function to toggle the visibility of the account list
function toggleAccountDisplay() {
    const accountList = document.getElementById('account-list');
    if (accountList.style.display === 'none') {
        accountList.style.display = 'block';
        displayAccounts();  // Ensure the latest accounts are displayed
    } else {
        accountList.style.display = 'none';
    }
}

// Initialize account display on page load
window.onload = displayAccounts;
