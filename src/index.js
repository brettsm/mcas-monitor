import './style.css';
import {
    Chart,
    BarController,
    BarElement,
    PieController,
    ArcElement,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

Chart.register(LineController, LineElement, BarController, BarElement, PieController, ArcElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

//TODO: Add login functionality and a backend for continuity

const sections = {
    dashboard: `
        <h2>Welcome Back, [User's Name]!</h2>
        <p>Track your progress and stay on top of your health journey. Let’s make today count!</p>

        <div class="quick-stats">
            <div class="stat-item">
                <h3>25</h3>
                <p>Symptoms Logged</p>
            </div>
            <div class="stat-item">
                <h3>10</h3>
                <p>Trigger-Free Days</p>
            </div>
            <div class="stat-item">
                <h3>Fatigue</h3>
                <p>Most Common Symptom</p>
            </div>
        </div>

        <h3>Recent Entries</h3>
        <ul class="recent-entries">
            <li>11/22/2024: Headache - Severity 6</li>
            <li>11/20/2024: Fatigue - Severity 8</li>
            <li>11/19/2024: Hives - Severity 5</li>
        </ul>

        <h3>Your Symptom Trends</h3>
        <canvas id="symptom-trends-chart"></canvas>

        <h3>Most Common Triggers</h3>
        <p>Food: High-Histamine (Avocado, Spinach)</p>
        <p>Environmental: Dust, Perfumes</p>

        <h3>Insights</h3>
        <p>We noticed that hives tend to occur more often after consuming high-histamine foods. Consider logging meals in detail to refine this correlation.</p>

        <h3>Quick Actions</h3>
        <button onclick="navigateTo('symptoms')">Log a Symptom</button>
        <button onclick="navigateTo('analytics')">View Analytics</button>
    </div>
    `,
    symptoms: `
        <h2>Symptoms</h2>
        <p>Log your symptoms to keep track of patterns and changes over time.</p>
        
        <h3>Log a Symptom</h3>
        <form id="symptom-form">
            <label for="symptom-name">Symptom:</label>
            <input type="text" id="symptom-name" placeholder="e.g., Headache" required />

            <label for="symptom-severity">Severity (1-10):</label>
            <input type="number" id="symptom-severity" min="1" max="10" required />

            <button type="submit">Log Symptom</button>
        </form>

        <h3>Logged Symptoms</h3>
        <table id="symptom-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Symptom</th>
                    <th>Severity</th>
                </tr>
            </thead>
            <tbody>
                <!-- Logged symptoms will appear here -->
            </tbody>
        </table>

        <h3>Symptoms Overview</h3>
        <canvas id="symptom-overview-chart"></canvas>
    `,
    triggers: `
        <h2>Triggers</h2>
        <p>Identify potential triggers and manage your environment to avoid flares.</p>
        
        <h3>Log a Trigger</h3>
        <form id="trigger-form">
            <label for="trigger-name">Trigger:</label>
            <input type="text" id="trigger-name" placeholder="e.g., Dust, Perfume" required />

            <label for="trigger-category">Category:</label>
            <select id="trigger-category" required>
                <option value="food">Food</option>
                <option value="environmental">Environmental</option>
                <option value="emotional">Emotional</option>
            </select>

            <button type="submit">Log Trigger</button>
        </form>

        <h3>Logged Triggers</h3>
        <table id="trigger-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Trigger</th>
                    <th>Category</th>
                </tr>
            </thead>
            <tbody>
                <!-- Logged triggers will appear here -->
            </tbody>
        </table>

        <h3>Trigger Summary</h3>
        <canvas id="trigger-summary-chart"></canvas>
    `,
    analytics: `
        <h2>Analytics</h2>
        <p>Analyze your data to discover trends and insights about your condition.</p>
        
        <h3>Symptom Trends</h3>
        <canvas id="symptom-trend-chart"></canvas>

        <h3>Trigger Categories</h3>
        <canvas id="trigger-category-chart"></canvas>

        <h3>Resource Summary</h3>
        <canvas id="resource-summary-chart"></canvas>
    `,
    resources: `
        <h2>Resources</h2>
        <p>Access guides, tools, and support networks to help manage your symptoms effectively.</p>
        
        <h3>Add a Resource</h3>
        <form id="resource-form">
            <label for="resource-title">Title:</label>
            <input type="text" id="resource-title" placeholder="e.g., Low-Histamine Food Guide" required />

            <label for="resource-link">Link:</label>
            <input type="url" id="resource-link" placeholder="https://example.com" required />

            <label for="resource-category">Category:</label>
            <select id="resource-category" required>
                <option value="articles">Articles</option>
                <option value="tools">Tools</option>
                <option value="support">Support Networks</option>
            </select>

            <button type="submit">Add Resource</button>
        </form>

        <h3>Search Resources</h3>
        <input type="text" id="resource-search" placeholder="Search resources..." />

        <h3>All Resources</h3>
        <table id="resource-table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Link</th>
                </tr>
            </thead>
            <tbody>
                <!-- Resources will appear here -->
            </tbody>
        </table>

        <h3>Resource Summary</h3>
        <canvas id="resource-summary-chart"></canvas>
    `,
    login: `
        <div class="login-container">
            <h2>Login</h2>
            <form id="login-form">
                <label for="username">Username:</label>
                <input type="text" id="username" placeholder="Enter your username" required />

                <label for="password">Password:</label>
                <input type="password" id="password" placeholder="Enter your password" required />

                <button type="submit">Login</button>
            </form>
            <p id="login-error" class="error-message" style="display: none;">Invalid username or password. Please try again.</p>
        </div>
    `
};

//Handle navbar clicks
const navbarLinks = document.querySelectorAll('.navbar a');
const contentDiv = document.getElementById('content');

function loadContent(section) {
    if (sections[section]) {
        // Fade-out transition
        contentDiv.classList.remove('loaded');
        setTimeout(() => {
            contentDiv.innerHTML = sections[section];
            contentDiv.classList.add('loaded'); // Fade-in transition

            if (section === 'analytics') {
                setupAnalytics();
            }
            
            if (section === 'resources') {
                setupResourceManagement();
            }

            // Setup system trigger logging
            if (section === 'triggers') {
                setupTriggerLogging();
            }

            // Setup system logging if the dashboard is loaded
            if (section === 'symptoms') {
                setupSymptomLogging();
            }

            if (section === 'login') {
                setupLogin();
            }
            // Initialize the chart if the dashboard is loaded
            if (section === 'dashboard') {
                const canvas = document.getElementById('symptom-trends-chart');
                if (canvas) {
                    const ctx = canvas.getContext('2d');
                    new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: ['11/18', '11/19', '11/20', '11/21', '11/22'], // Dates
                            datasets: [{
                                label: 'Symptom Severity',
                                data: [3, 5, 8, 6, 4], // Example symptom severity data
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 2,
                                fill: false
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    max: 10 // Scale from 0 to 10
                                }
                            }
                        }
                    });
                }
            }
        }, 300);
    }
}

navbarLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const target = event.target.getAttribute('data-target');
        
        // Push state to browser history
        history.pushState({ section: target }, '', `#${target}`);
        loadContent(target);
    });
});

//Handle back/forward navigation
window.addEventListener('popstate', (event) => {
    const section = event.state?.section || 'dashboard';
    loadContent(section);
});

window.addEventListener('load', () => {
    const initialSection = location.hash.replace('#', '') || 'dashboard'; // Default to 'dashboard'
    history.replaceState({ section: initialSection }, '', `#${initialSection}`);
    loadContent(initialSection);
});



//Symptom functions
function setupSymptomLogging() {
    const symptomForm = document.getElementById('symptom-form');
    const symptomTableBody = document.querySelector('#symptom-table tbody');
    const symptomsData = []; // Array to hold logged symptoms

    symptomForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // Get form values
        const symptomName = document.getElementById('symptom-name').value.trim();
        const symptomSeverity = parseInt(document.getElementById('symptom-severity').value.trim(), 10);
        const symptomDate = new Date().toLocaleDateString();

        // Save the symptom
        symptomsData.push({ date: symptomDate, name: symptomName, severity: symptomSeverity });

        // Add the symptom to the table
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${symptomDate}</td>
            <td>${symptomName}</td>
            <td>${symptomSeverity}</td>
        `;
        symptomTableBody.appendChild(row);

        // Update the chart
        updateSymptomsChart(symptomsData);

        // Clear the form
        symptomForm.reset();
    });

    // Initialize the chart
    const canvas = document.getElementById('symptom-overview-chart');
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Symptom Severity',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10
                }
            }
        }
    });

    function updateSymptomsChart(data) {
        // Aggregate severity by symptom
        const symptomCounts = data.reduce((acc, curr) => {
            acc[curr.name] = (acc[curr.name] || 0) + curr.severity;
            return acc;
        }, {});

        // Update chart data
        chart.data.labels = Object.keys(symptomCounts);
        chart.data.datasets[0].data = Object.values(symptomCounts);
        chart.update();
    }
}

// trigger page setup
function setupTriggerLogging() {
    const triggerForm = document.getElementById('trigger-form');
    const triggerTableBody = document.querySelector('#trigger-table tbody');
    const triggersData = [];

    triggerForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const triggerName = document.getElementById('trigger-name').value.trim();
        const triggerCategory = document.getElementById('trigger-category').value;
        const triggerDate = new Date().toLocaleDateString();

        triggersData.push({ date: triggerDate, name: triggerName, category: triggerCategory });

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${triggerDate}</td>
            <td>${triggerName}</td>
            <td>${triggerCategory}</td>
        `;
        triggerTableBody.appendChild(row);

        updateTriggerChart(triggersData);

        triggerForm.reset();
    });

    const canvas = document.getElementById('trigger-summary-chart');
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                label: 'Triggers',
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        }
    });

    function updateTriggerChart(data) {
        const categoryCounts = data.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + 1;
            return acc;
        }, {});

        chart.data.labels = Object.keys(categoryCounts);
        chart.data.datasets[0].data = Object.values(categoryCounts);
        chart.update();
    }
}


function setupResourceManagement() {
    const resourceForm = document.getElementById('resource-form');
    const resourceTableBody = document.querySelector('#resource-table tbody');
    const resourceSearch = document.getElementById('resource-search');
    const resourcesData = [];

    resourceForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const resourceTitle = document.getElementById('resource-title').value.trim();
        const resourceLink = document.getElementById('resource-link').value.trim();
        const resourceCategory = document.getElementById('resource-category').value;

        resourcesData.push({ title: resourceTitle, link: resourceLink, category: resourceCategory });

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${resourceTitle}</td>
            <td>${resourceCategory}</td>
            <td><a href="${resourceLink}" target="_blank">Visit</a></td>
        `;
        resourceTableBody.appendChild(row);

        updateResourceChart(resourcesData);

        resourceForm.reset();
    });

    resourceSearch.addEventListener('input', (event) => {
        const query = event.target.value.toLowerCase();
        const filteredResources = resourcesData.filter(resource => 
            resource.title.toLowerCase().includes(query) || resource.category.toLowerCase().includes(query)
        );
        renderResourceTable(filteredResources);
    });

    const canvas = document.getElementById('resource-summary-chart');
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                label: 'Resources',
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        }
    });

    function updateResourceChart(data) {
        const categoryCounts = data.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + 1;
            return acc;
        }, {});

        chart.data.labels = Object.keys(categoryCounts);
        chart.data.datasets[0].data = Object.values(categoryCounts);
        chart.update();
    }

    function renderResourceTable(data) {
        resourceTableBody.innerHTML = '';
        data.forEach(resource => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${resource.title}</td>
                <td>${resource.category}</td>
                <td><a href="${resource.link}" target="_blank">Visit</a></td>
            `;
            resourceTableBody.appendChild(row);
        });
    }
}

function setupAnalytics() {
    // Sample Data: Replace with real logged data
    const symptomsData = [
        { date: '11/20/2024', severity: 6 },
        { date: '11/21/2024', severity: 7 },
        { date: '11/22/2024', severity: 8 }
    ];

    const triggersData = [
        { category: 'food' },
        { category: 'environmental' },
        { category: 'food' }
    ];

    const resourcesData = [
        { category: 'articles' },
        { category: 'tools' },
        { category: 'tools' }
    ];

    // Symptom Trends Chart
    const symptomTrendCtx = document.getElementById('symptom-trend-chart').getContext('2d');
    new Chart(symptomTrendCtx, {
        type: 'line',
        data: {
            labels: symptomsData.map(entry => entry.date), // Dates
            datasets: [{
                label: 'Symptom Severity',
                data: symptomsData.map(entry => entry.severity), // Severity
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10 // Scale from 0 to 10
                }
            }
        }
    });

    // Trigger Categories Chart
    const triggerCategoryCounts = triggersData.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + 1;
        return acc;
    }, {});
    const triggerCategoryCtx = document.getElementById('trigger-category-chart').getContext('2d');
    new Chart(triggerCategoryCtx, {
        type: 'pie',
        data: {
            labels: Object.keys(triggerCategoryCounts),
            datasets: [{
                data: Object.values(triggerCategoryCounts),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        }
    });

    // Resource Summary Chart
    const resourceCategoryCounts = resourcesData.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + 1;
        return acc;
    }, {});
    const resourceSummaryCtx = document.getElementById('resource-summary-chart').getContext('2d');
    new Chart(resourceSummaryCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(resourceCategoryCounts),
            datasets: [{
                label: 'Resources',
                data: Object.values(resourceCategoryCounts),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function setupLogin() {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    // Dummy user data for validation
    //TODO: replace dummy user data with API call or database access
    const validUser = { username: 'user123', password: 'password123' };

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (username === validUser.username && password === validUser.password) {
            // Successful login
            loadContent('dashboard'); // Redirect to dashboard
        } else {
            // Show error message
            loginError.style.display = 'block';
        }
    });
}




