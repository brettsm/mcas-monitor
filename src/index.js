import './style.css';
import {
    Chart,
    BarController,
    BarElement,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

Chart.register(LineController, LineElement, BarController, BarElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

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
    `,
    resources: `
        <h2>Resources</h2>
        <p>Access guides, tools, and support networks to help manage your symptoms effectively.</p>
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

            // Setup system trigger logging
            if (section === 'triggers') {
                setupTriggerLogging();
            }

            // Setup system logging if the dashboard is loaded
            if (section === 'symptoms') {
                setupSymptomLogging();
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


