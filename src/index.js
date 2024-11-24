import './style.css';

const sections = {
    dashboard: `
        <h2>Dashboard</h2>
        <p>Welcome to your MCAS Tracker dashboard! View your latest updates and progress here.</p>
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

