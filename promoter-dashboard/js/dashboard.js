// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Navigation handling
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.target.getAttribute('href').substring(1);
            handleNavigation(target);
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', debounce(handleSearch, 300));

    // Initialize dashboard
    initializeDashboard();
});

// Navigation handler
function handleNavigation(target) {
    // Remove active class from all links
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    
    // Add active class to clicked link
    const activeLink = document.querySelector(`a[href="#${target}"]`).parentElement;
    activeLink.classList.add('active');

    // Update content based on navigation
    updateContent(target);
}

// Search handler
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    // Implement search functionality
    console.log('Searching for:', searchTerm);
}

// Dashboard initialization
async function initializeDashboard() {
    try {
        // Fetch dashboard data
        const dashboardData = await fetchDashboardData();
        updateDashboardStats(dashboardData);
        updateRecentActivity(dashboardData.recentActivity);
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showError('Failed to load dashboard data');
    }
}

// Fetch dashboard data
async function fetchDashboardData() {
    // This would be replaced with actual API calls
    return {
        stats: {
            ticketsSold: 1234,
            revenue: 45678,
            activeEvents: 5,
            totalCustomers: 892
        },
        recentActivity: [
            {
                type: 'ticket_sale',
                message: 'New ticket sale for Event XYZ',
                timestamp: new Date()
            },
            {
                type: 'event_creation',
                message: 'New event created: Summer Festival',
                timestamp: new Date()
            }
        ]
    };
}

// Update dashboard statistics
function updateDashboardStats(data) {
    // Update stats cards with real data
    document.querySelector('.stat-card:nth-child(1) .stat-info p').textContent = data.stats.ticketsSold;
    document.querySelector('.stat-card:nth-child(2) .stat-info p').textContent = `$${data.stats.revenue}`;
    document.querySelector('.stat-card:nth-child(3) .stat-info p').textContent = data.stats.activeEvents;
    document.querySelector('.stat-card:nth-child(4) .stat-info p').textContent = data.stats.totalCustomers;
}

// Update recent activity
function updateRecentActivity(activities) {
    const activityList = document.querySelector('.activity-list');
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas ${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-details">
                <p>${activity.message}</p>
                <small>${formatTimestamp(activity.timestamp)}</small>
            </div>
        </div>
    `).join('');
}

// Helper function to get activity icon
function getActivityIcon(type) {
    const icons = {
        ticket_sale: 'fa-ticket-alt',
        event_creation: 'fa-calendar-plus',
        user_registration: 'fa-user-plus',
        payment: 'fa-credit-card'
    };
    return icons[type] || 'fa-info-circle';
}

// Helper function to format timestamp
function formatTimestamp(timestamp) {
    return new Date(timestamp).toLocaleString();
}

// Helper function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Error handling
function showError(message) {
    // Implement error notification
    console.error(message);
}

// Content update handler
function updateContent(target) {
    // This would be replaced with actual content loading logic
    console.log(`Loading content for: ${target}`);
} 