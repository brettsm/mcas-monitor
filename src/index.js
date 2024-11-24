import './style.css';
import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

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
    `,
    triggers: `
        <h2>Triggers</h2>
        <p>Identify potential triggers and manage your environment to avoid flares.</p>
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


