// API Keys (would normally be secured on the backend)
const YOUTUBE_API_KEY = 'YOUTUBE-API-KEY';
const OPENAI_API_KEY = 'OPEN-AI-API-KEY';

// Global Variables
let creatorsData = [];
let currentPage = 1;
const creatorsPerPage = 9;
let selectedCreator = null;
let risingStarsData = [];

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM content loaded - initializing application");
    try {
        // Initialize the page
        console.log("Initializing charts");
        initializeCharts();
        
        console.log("Loading creators");
        loadCreators();
        
        // Add event listeners
        console.log("Setting up event listeners");
        setupEventListeners();
    } catch (error) {
        console.error("Error during initialization:", error);
    }
});

// Setup Event Listeners
function setupEventListeners() {
    // Creator search and filters
    const creatorSearch = document.getElementById('creator-search');
    if (creatorSearch) creatorSearch.addEventListener('input', filterCreators);
    
    const gameFilter = document.getElementById('game-filter');
    if (gameFilter) gameFilter.addEventListener('change', filterCreators);
    
    const audienceFilter = document.getElementById('audience-filter');
    if (audienceFilter) audienceFilter.addEventListener('change', filterCreators);
    
    const sizeFilter = document.getElementById('size-filter');
    if (sizeFilter) sizeFilter.addEventListener('change', filterCreators);
    
    const engagementFilter = document.getElementById('engagement-filter');
    if (engagementFilter) engagementFilter.addEventListener('change', filterCreators);
    
    // Load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) loadMoreBtn.addEventListener('click', loadMoreCreators);
    
    // Back to creators button
    const backToCreators = document.getElementById('back-to-creators');
    if (backToCreators) backToCreators.addEventListener('click', hideCreatorProfile);
    
    // Global search
    const globalSearch = document.getElementById('global-search');
    if (globalSearch) {
        globalSearch.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                performGlobalSearch();
            }
        });
    }
    
    const searchButton = document.getElementById('search-button');
    if (searchButton) searchButton.addEventListener('click', performGlobalSearch);
    
    // Analytics
    const applyAnalytics = document.getElementById('apply-analytics');
    if (applyAnalytics) applyAnalytics.addEventListener('click', applyAnalyticsFilters);
    
    // AI Assistant
    const sendMessage = document.getElementById('send-message');
    if (sendMessage) sendMessage.addEventListener('click', sendChatMessage);
    
    const userMessage = document.getElementById('user-message');
    if (userMessage) {
        userMessage.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
}

// Load Creators from YouTube API
async function loadCreators() {
    try {
        console.log("Generating mock creators...");
        const mockCreators = generateMockCreators();
        console.log("Generated creators count:", mockCreators.length);
        creatorsData = mockCreators;
        
        displayCreators(mockCreators);
        updateCharts(mockCreators);
        
        // Load rising stars after creators are loaded
        console.log("Loading rising stars");
        loadRisingStars();
    } catch (error) {
        console.error('Error loading creators:', error);
    }
}

// Generate Mock Creators
function generateMockCreators() {
    console.log("Inside generateMockCreators function");
    const gameCategories = ['BGMI', 'Free Fire', 'Minecraft', 'GTA V', 'Valorant', 'Call of Duty Mobile'];
    const creators = [];
    
    // Generate 50 mock creators
    for (let i = 0; i < 50; i++) {
        const name = getRandomCreatorName();
        const game = gameCategories[Math.floor(Math.random() * gameCategories.length)];
        const tags = [game, 'gaming', Math.random() > 0.5 ? 'commentary' : 'live', Math.random() > 0.7 ? 'comedy' : 'competitive'];
        const subscriberBrackets = [
            5000 + Math.random() * 45000,
            50000 + Math.random() * 50000,
            100000 + Math.random() * 400000,
            500000 + Math.random() * 1500000
        ];
        const subscribers = subscriberBrackets[Math.floor(Math.random() * subscriberBrackets.length)];
        const engagementRate = 2 + Math.random() * 18;
        const audience = [];
        
        if (Math.random() > 0.3) audience.push('teen');
        if (Math.random() > 0.4) audience.push('youngadult');
        if (Math.random() > 0.7) audience.push('adult');
        
        if (audience.length === 0) audience.push('youngadult');
        
        const creator = {
            id: `creator-${i + 1}`,
            name: name,
            thumbnail: 'assets/placeholder-creator.svg',
            subscribers: Math.round(subscribers),
            engagementRate: parseFloat(engagementRate.toFixed(1)),
            videoCount: Math.floor(20 + Math.random() * 980),
            description: getRandomDescription(name, game),
            tags: tags,
            audience: audience,
            estimatedCost: Math.round((subscribers / 10000) * (engagementRate / 10) * 1000),
            growthRate: parseFloat((5 + Math.random() * 30).toFixed(1))
        };
        
        creators.push(creator);
    }
    
    if (creators.length === 0) {
        console.error("No creators were generated!");
    } else {
        console.log(`Generated ${creators.length} creators. First creator:`, creators[0]);
    }
    
    return creators;
}

function getRandomCreatorName() {
    console.log("Generating random creator name");
    const firstNames = ['Ankit', 'Rahul', 'Priya', 'Neha', 'Amit', 'Vikram', 'Rishi', 'Arjun', 'Divya', 'Karan'];
    const lastNames = ['Gaming', 'Plays', 'Live', 'Official', 'YT', 'Streams', 'Pro', 'Gamer', 'OP', 'Insane'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;
    
    console.log(`Generated name: ${fullName}`);
    return fullName;
}

function getRandomDescription(name, game) {
    console.log(`Generating description for ${name} playing ${game}`);
    const descriptions = [
        `${name} is a popular ${game} streamer known for high-quality gameplay and entertaining commentary. They create daily content focused on competitive play and engaging with their community.`,
        `One of the top ${game} content creators in India with a rapidly growing fanbase. ${name} focuses on ${game} tutorials, gameplay, and live streams with viewer interaction.`,
        `${name} specializes in ${game} content, creating videos that combine competitive gameplay with humor and entertainment. Their channel features gameplay highlights, challenges, and community events.`,
        `A rising star in the ${game} community, ${name} creates content that appeals to both casual and hardcore gamers. Their channel features gameplay videos, tips and tricks, and collaborations with other creators.`
    ];
    
    const descIndex = Math.floor(Math.random() * descriptions.length);
    console.log(`Selected description index: ${descIndex}`);
    return descriptions[descIndex];
}

function getRandomVideoTitle(creator) {
    const game = creator.tags.find(tag => tag !== 'gaming' && tag !== 'commentary' && tag !== 'live' && tag !== 'comedy' && tag !== 'competitive');
    
    const templates = [
        `EPIC ${game} GAMEPLAY | 20 KILLS VICTORY ROYALE`,
        `${game} Live Stream - Road to 1 Million Subscribers`,
        `Playing ${game} with Subscribers | Sunday Special`,
        `${game} New Update First Look | Insane New Features`,
        `How to Become a Pro at ${game} | Tips & Tricks`,
        `${game} Tournament Highlights | ₹100,000 Prize Pool`,
        `This ${game} Strategy Will Change Everything!`,
        `When NOOBS Play ${game} 😂 | Funny Moments`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
}

// Helper functions
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    } else {
        return num.toString();
    }
}

// Load Rising Stars
function loadRisingStars() {
    // Filter creators with high growth rate, engagement, and specific subscriber count
    risingStarsData = creatorsData.filter(creator => {
        return creator.engagementRate >= 12 && 
               creator.subscribers >= 10000 && 
               creator.subscribers <= 100000 &&
               creator.growthRate >= 20;
    });
    
    displayRisingStars(risingStarsData);
}

// Display Rising Stars
function displayRisingStars(creators) {
    console.log(`Displaying ${creators.length} rising stars`);
    const container = document.getElementById('rising-stars-container');
    
    if (!container) {
        console.error("Rising stars container element not found!");
        return;
    }
    
    container.innerHTML = '';
    
    if (creators.length === 0) {
        console.log("No rising stars to display");
        container.innerHTML = '<div class="no-creators">No rising stars found at this time.</div>';
        return;
    }
    
    creators.slice(0, 8).forEach(creator => {
        console.log(`Creating rising star card for ${creator.name}`);
        const creatorCard = document.createElement('div');
        creatorCard.className = 'creator-card';
        creatorCard.setAttribute('data-id', creator.id);
        
        creatorCard.innerHTML = `
            <img src="${creator.thumbnail}" alt="${creator.name}" class="creator-thumb">
            <div class="creator-info">
                <h3 class="creator-name">${creator.name}</h3>
                <div class="creator-stats">
                    <div class="creator-stat">
                        <span class="stat-value">${formatNumber(creator.subscribers)}</span>
                        <span>Subscribers</span>
                    </div>
                    <div class="creator-stat">
                        <span class="stat-value">${creator.engagementRate}%</span>
                        <span>Engagement</span>
                    </div>
                    <div class="creator-stat">
                        <span class="stat-value">+${creator.growthRate}%</span>
                        <span>Growth/mo</span>
                    </div>
                </div>
                <div class="creator-tags">
                    ${creator.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        creatorCard.addEventListener('click', () => showCreatorProfile(creator.id));
        container.appendChild(creatorCard);
    });
}

// Display Creators in the grid
function displayCreators(creators, replace = true) {
    console.log(`Displaying ${creators.length} creators. Replace: ${replace}`);
    const container = document.getElementById('creators-container');
    
    if (!container) {
        console.error("Creator container element not found!");
        return;
    }
    
    if (replace) {
        container.innerHTML = '';
    }
    
    if (creators.length === 0) {
        console.log("No creators to display");
        container.innerHTML = '<div class="no-creators">No creators found matching your criteria.</div>';
        document.getElementById('load-more-btn').style.display = 'none';
        return;
    }
    
    const endIndex = currentPage * creatorsPerPage;
    const displayCreators = creators.slice(0, endIndex);
    
    console.log(`Displaying ${displayCreators.length} creators out of ${creators.length}`);
    
    displayCreators.forEach(creator => {
        console.log(`Creating card for ${creator.name}`);
        const creatorCard = document.createElement('div');
        creatorCard.className = 'creator-card';
        creatorCard.setAttribute('data-id', creator.id);
        
        creatorCard.innerHTML = `
            <img src="${creator.thumbnail}" alt="${creator.name}" class="creator-thumb">
            <div class="creator-info">
                <h3 class="creator-name">${creator.name}</h3>
                <div class="creator-stats">
                    <div class="creator-stat">
                        <span class="stat-value">${formatNumber(creator.subscribers)}</span>
                        <span>Subscribers</span>
                    </div>
                    <div class="creator-stat">
                        <span class="stat-value">${creator.engagementRate}%</span>
                        <span>Engagement</span>
                    </div>
                    <div class="creator-stat">
                        <span class="stat-value">₹${creator.estimatedCost}</span>
                        <span>Est. Cost</span>
                    </div>
                </div>
                <p>${creator.description.substring(0, 80)}${creator.description.length > 80 ? '...' : ''}</p>
                <div class="creator-tags">
                    ${creator.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        creatorCard.addEventListener('click', () => showCreatorProfile(creator.id));
        container.appendChild(creatorCard);
    });
    
    // Show/hide load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = displayCreators.length < creators.length ? 'block' : 'none';
    }
}

// Filter Creators based on search and filters
function filterCreators() {
    const searchQuery = document.getElementById('creator-search').value.toLowerCase();
    const gameFilter = document.getElementById('game-filter').value;
    const audienceFilter = document.getElementById('audience-filter').value;
    const sizeFilter = document.getElementById('size-filter').value;
    const engagementFilter = document.getElementById('engagement-filter').value;
    
    console.log(`Filtering creators: game=${gameFilter}, audience=${audienceFilter}, size=${sizeFilter}, engagement=${engagementFilter}`);
    
    // Reset page
    currentPage = 1;
    
    // Filter creators based on criteria
    const filteredCreators = creatorsData.filter(creator => {
        // Search query
        const matchesSearch = creator.name.toLowerCase().includes(searchQuery) || 
                              creator.description.toLowerCase().includes(searchQuery);
        
        // Game filter - check if gameFilter exactly matches any tag
        const matchesGame = gameFilter === 'all' || 
                           creator.tags.some(tag => tag === gameFilter);
        
        // Audience filter
        const matchesAudience = audienceFilter === 'all' || 
                               creator.audience.includes(audienceFilter);
        
        // Size filter
        let matchesSize = sizeFilter === 'all';
        if (sizeFilter === 'micro' && creator.subscribers < 50000) matchesSize = true;
        if (sizeFilter === 'small' && creator.subscribers >= 50000 && creator.subscribers < 100000) matchesSize = true;
        if (sizeFilter === 'medium' && creator.subscribers >= 100000 && creator.subscribers < 500000) matchesSize = true;
        if (sizeFilter === 'large' && creator.subscribers >= 500000) matchesSize = true;
        
        // Engagement filter
        let matchesEngagement = engagementFilter === 'all';
        if (engagementFilter === 'low' && creator.engagementRate < 5) matchesEngagement = true;
        if (engagementFilter === 'medium' && creator.engagementRate >= 5 && creator.engagementRate < 10) matchesEngagement = true;
        if (engagementFilter === 'high' && creator.engagementRate >= 10) matchesEngagement = true;
        
        return matchesSearch && matchesGame && matchesAudience && matchesSize && matchesEngagement;
    });
    
    console.log(`Found ${filteredCreators.length} creators after filtering`);
    
    // Display filtered creators
    displayCreators(filteredCreators);
}

// Load more creators
function loadMoreCreators() {
    currentPage++;
    displayCreators(creatorsData, false);
}

// Global search
function performGlobalSearch() {
    const query = document.getElementById('global-search').value.toLowerCase();
    
    if (!query) return;
    
    console.log(`Performing global search for: ${query}`);
    
    // Switch to creators tab
    const creatorsLink = document.querySelector('nav a[href="#creators"]');
    if (creatorsLink) {
        creatorsLink.click();
    } else {
        console.warn("Creators link not found");
    }
    
    // Set search query and filter
    const creatorSearch = document.getElementById('creator-search');
    if (creatorSearch) {
        creatorSearch.value = query;
        filterCreators();
    } else {
        console.warn("Creator search input not found");
    }
}

// Apply Analytics Filters
function applyAnalyticsFilters() {
    // In a real app, this would update the analytics charts based on filters
    alert('Analytics filters applied!');
}

// Initialize Charts
function initializeCharts() {
    // Create charts on the dashboard if the elements exist
    if (document.getElementById('engagement-distribution-chart')) {
        createEngagementDistributionChart();
    }
    
    if (document.getElementById('game-distribution-chart')) {
        createGameDistributionChart();
    }
    
    if (document.getElementById('growth-chart')) {
        createGrowthChart();
    }

    // Initialize analytics charts if they exist
    if (document.getElementById('engagement-chart')) {
        createEngagementChart();
    }
    
    if (document.getElementById('audience-chart')) {
        createAudienceChart();
    }
    
    if (document.getElementById('trend-chart')) {
        createTrendChart();
    }
}

// Create Engagement Distribution Chart
function createEngagementDistributionChart() {
    const ctx = document.getElementById('engagement-distribution-chart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['< 5%', '5-10%', '10-15%', '> 15%'],
            datasets: [{
                label: 'Creators by Engagement Rate',
                data: [15, 25, 40, 20],
                backgroundColor: [
                    'rgba(0, 150, 0, 0.5)',
                    'rgba(0, 175, 0, 0.5)',
                    'rgba(0, 200, 0, 0.5)',
                    'rgba(0, 255, 0, 0.5)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '# of Creators'
                    }
                }
            }
        }
    });
}

// Create Game Distribution Chart
function createGameDistributionChart() {
    const ctx = document.getElementById('game-distribution-chart').getContext('2d');
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['BGMI', 'Free Fire', 'Minecraft', 'GTA V', 'Valorant', 'Other'],
            datasets: [{
                data: [30, 25, 15, 10, 10, 10],
                backgroundColor: [
                    'rgba(0, 255, 0, 0.7)',
                    'rgba(0, 225, 0, 0.7)',
                    'rgba(0, 200, 0, 0.7)',
                    'rgba(0, 175, 0, 0.7)',
                    'rgba(0, 150, 0, 0.7)',
                    'rgba(0, 125, 0, 0.7)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Create Growth Chart
function createGrowthChart() {
    const ctx = document.getElementById('growth-chart').getContext('2d');
    
    // Generate random data for the last 6 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const subscriberGrowth = months.map(() => 15 + Math.random() * 10);
    const engagementGrowth = months.map(() => 5 + Math.random() * 10);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Subscriber Growth %',
                    data: subscriberGrowth,
                    borderColor: 'rgba(0, 255, 0, 1)',
                    backgroundColor: 'rgba(0, 255, 0, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Engagement Growth %',
                    data: engagementGrowth,
                    borderColor: 'rgba(0, 150, 0, 1)',
                    backgroundColor: 'rgba(0, 150, 0, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Growth Rate (%)'
                    }
                }
            }
        }
    });
}

// Create other analytics charts
function createEngagementChart() {
    const ctx = document.getElementById('engagement-chart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Micro (1K-50K)', 'Small (50K-100K)', 'Medium (100K-500K)', 'Large (500K+)'],
            datasets: [{
                label: 'Average Engagement Rate (%)',
                data: [12.5, 8.7, 6.2, 4.8],
                backgroundColor: 'rgba(0, 255, 0, 0.7)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Engagement Rate (%)'
                    }
                }
            }
        }
    });
}

function createAudienceChart() {
    const ctx = document.getElementById('audience-chart').getContext('2d');
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Teen (13-17)', 'Young Adult (18-24)', 'Adult (25-34)', '35+'],
            datasets: [{
                data: [35, 45, 15, 5],
                backgroundColor: [
                    'rgba(0, 255, 0, 0.7)',
                    'rgba(0, 225, 0, 0.7)',
                    'rgba(0, 195, 0, 0.7)',
                    'rgba(0, 165, 0, 0.7)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createTrendChart() {
    const ctx = document.getElementById('trend-chart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['BGMI', 'Free Fire', 'Minecraft', 'GTA V', 'Valorant', 'Call of Duty'],
            datasets: [{
                label: 'Growth Rate (last 3 months)',
                data: [42, 38, 25, 22, 36, 30],
                backgroundColor: 'rgba(0, 255, 0, 0.7)'
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Growth Rate (%)'
                    }
                }
            }
        }
    });
}

// Update Charts with actual data
function updateCharts(creators) {
    // In a real app, this would update the charts with the actual data from creators
    console.log("Updating charts with creator data");
}

// Show Creator Profile
function showCreatorProfile(creatorId) {
    console.log(`Showing profile for creator ${creatorId}`);
    const creator = creatorsData.find(c => c.id === creatorId);
    if (!creator) {
        console.error(`Creator with ID ${creatorId} not found!`);
        return;
    }
    
    selectedCreator = creator;
    
    // Hide creators list and show profile
    const creatorsSection = document.getElementById('creators');
    const profileSection = document.getElementById('creator-profile');
    
    if (creatorsSection && profileSection) {
        creatorsSection.classList.add('hidden');
        profileSection.classList.remove('hidden');
    } else {
        console.error("Creators or profile section not found");
        return;
    }
    
    // Update profile elements
    document.getElementById('profile-img').src = creator.thumbnail;
    document.getElementById('profile-name').textContent = creator.name;
    document.getElementById('profile-subscribers').textContent = formatNumber(creator.subscribers);
    document.getElementById('profile-engagement').textContent = `${creator.engagementRate}%`;
    document.getElementById('profile-videos').textContent = creator.videoCount || '500+';
    document.getElementById('profile-cost').textContent = creator.estimatedCost;
    document.getElementById('profile-description').textContent = creator.description;
    
    // Update tags
    const tagsContainer = document.getElementById('profile-tags');
    if (tagsContainer) {
        tagsContainer.innerHTML = '';
        creator.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag';
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });
    }
    
    // Load audience demographics chart
    loadAudienceDemographics(creator);
    
    // Load engagement metrics chart
    loadEngagementMetrics(creator);
    
    // Load recent videos
    loadRecentVideos(creator);
    
    // Load brand fit analysis
    loadBrandFitAnalysis(creator);
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Hide Creator Profile
function hideCreatorProfile() {
    const creatorsSection = document.getElementById('creators');
    const profileSection = document.getElementById('creator-profile');
    
    if (creatorsSection && profileSection) {
        creatorsSection.classList.remove('hidden');
        profileSection.classList.add('hidden');
    }
    
    selectedCreator = null;
}

// Load Audience Demographics
function loadAudienceDemographics(creator) {
    const ctx = document.getElementById('profile-audience-chart');
    if (!ctx) {
        console.error("Audience chart canvas not found");
        return;
    }
    
    // Get audience percentages based on creator's audience
    const teenPercentage = creator.audience.includes('teen') ? 40 + Math.random() * 30 : 5 + Math.random() * 10;
    const youngAdultPercentage = creator.audience.includes('youngadult') ? 30 + Math.random() * 30 : 10 + Math.random() * 20;
    const adultPercentage = creator.audience.includes('adult') ? 15 + Math.random() * 20 : 5 + Math.random() * 10;
    const total = teenPercentage + youngAdultPercentage + adultPercentage;
    
    if (window.audienceDemographicsChart) {
        window.audienceDemographicsChart.destroy();
    }
    
    window.audienceDemographicsChart = new Chart(ctx.getContext('2d'), {
        type: 'pie',
        data: {
            labels: ['Teen (13-17)', 'Young Adult (18-24)', 'Adult (25+)'],
            datasets: [{
                data: [
                    Math.round((teenPercentage / total) * 100), 
                    Math.round((youngAdultPercentage / total) * 100), 
                    Math.round((adultPercentage / total) * 100)
                ],
                backgroundColor: [
                    'rgba(0, 255, 0, 0.7)',
                    'rgba(0, 200, 0, 0.7)',
                    'rgba(0, 150, 0, 0.7)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Load Engagement Metrics
function loadEngagementMetrics(creator) {
    const ctx = document.getElementById('profile-engagement-chart');
    if (!ctx) {
        console.error("Engagement chart canvas not found");
        return;
    }
    
    if (window.engagementMetricsChart) {
        window.engagementMetricsChart.destroy();
    }
    
    // Generate random data for the last 6 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const engagementData = months.map(() => (creator.engagementRate - 2) + Math.random() * 4);
    const industryAvg = months.map(() => 5.5 + Math.random() * 1.5);
    
    window.engagementMetricsChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Creator Engagement',
                    data: engagementData,
                    borderColor: 'rgba(0, 255, 0, 1)',
                    backgroundColor: 'rgba(0, 255, 0, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Industry Average',
                    data: industryAvg,
                    borderColor: 'rgba(150, 150, 150, 1)',
                    backgroundColor: 'rgba(150, 150, 150, 0.1)',
                    tension: 0.4,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Engagement Rate (%)'
                    }
                }
            }
        }
    });
}

// Load Recent Videos
function loadRecentVideos(creator) {
    const container = document.getElementById('profile-recent-videos');
    if (!container) {
        console.error("Recent videos container not found");
        return;
    }
    
    container.innerHTML = '';
    
    // Generate random videos
    for (let i = 0; i < 6; i++) {
        const video = {
            title: getRandomVideoTitle(creator),
            thumbnail: 'assets/placeholder-creator.svg',
            date: new Date(Date.now() - i * 86400000 * 3)
        };
        
        const videoElement = document.createElement('div');
        videoElement.className = 'video-item';
        videoElement.innerHTML = `
            <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail">
            <div class="video-info">
                <div class="video-title">${video.title}</div>
                <div class="video-date">${video.date.toLocaleDateString()}</div>
            </div>
        `;
        
        container.appendChild(videoElement);
    }
}

// Load Brand Fit Analysis
function loadBrandFitAnalysis(creator) {
    // Calculate brand fit score based on engagement, audience, and content
    const engagementScore = Math.min(creator.engagementRate / 15 * 10, 10);
    const audienceScore = creator.audience.includes('youngadult') ? 8 + Math.random() * 2 : 5 + Math.random() * 3;
    const contentScore = creator.tags.includes('gaming') ? 7 + Math.random() * 3 : 4 + Math.random() * 4;
    const brandFit = ((engagementScore + audienceScore + contentScore) / 3).toFixed(1);
    
    // Update brand fit ring
    const brandFitValue = document.getElementById('brand-fit-value');
    if (brandFitValue) {
        brandFitValue.textContent = brandFit;
    }
    
    // Update brand fit details
    const brandFitDetails = document.getElementById('brand-fit-details');
    if (brandFitDetails) {
        brandFitDetails.innerHTML = `
            <div class="fit-detail">
                <div class="fit-detail-label">
                    <span>Engagement Quality</span>
                    <span class="fit-value">${engagementScore.toFixed(1)}/10</span>
                </div>
                <div class="fit-progress">
                    <div class="fit-progress-bar" style="width: ${engagementScore * 10}%"></div>
                </div>
            </div>
            <div class="fit-detail">
                <div class="fit-detail-label">
                    <span>Audience Match</span>
                    <span class="fit-value">${audienceScore.toFixed(1)}/10</span>
                </div>
                <div class="fit-progress">
                    <div class="fit-progress-bar" style="width: ${audienceScore * 10}%"></div>
                </div>
            </div>
            <div class="fit-detail">
                <div class="fit-detail-label">
                    <span>Content Relevance</span>
                    <span class="fit-value">${contentScore.toFixed(1)}/10</span>
                </div>
                <div class="fit-progress">
                    <div class="fit-progress-bar" style="width: ${contentScore * 10}%"></div>
                </div>
            </div>
        `;
    }
}

// AI Chat Functions
async function sendChatMessage() {
    const userInput = document.getElementById('user-message');
    if (!userInput) {
        console.error("User message input not found");
        return;
    }
    
    const text = userInput.value.trim();
    if (!text) return;
    
    console.log(`Sending message: ${text}`);
    
    // Add user message to chat
    addMessageToChat('user', text);
    userInput.value = '';
    
    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message assistant typing';
    
    const typingContent = document.createElement('div');
    typingContent.className = 'message-content';
    typingContent.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    
    typingIndicator.appendChild(typingContent);
    
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Simulate API call to OpenAI
    try {
        // In a real implementation, this would call the OpenAI API
        const response = await simulateAIResponse(text);
        
        // Remove typing indicator
        if (chatMessages && typingIndicator) {
            chatMessages.removeChild(typingIndicator);
        }
        
        // Add AI response to chat
        addMessageToChat('assistant', response);
    } catch (error) {
        console.error('Error with AI assistant:', error);
        if (chatMessages && typingIndicator) {
            chatMessages.removeChild(typingIndicator);
        }
        addMessageToChat('assistant', 'Sorry, I encountered an error. Please try again.');
    }
}

function addMessageToChat(role, content) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) {
        console.error("Chat messages container not found");
        return;
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    // Format links in message
    const formattedContent = content.replace(
        /(https?:\/\/[^\s]+)/g, 
        '<a href="$1" target="_blank">$1</a>'
    );
    
    // Add message-content wrapper div
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = formattedContent;
    messageDiv.appendChild(contentDiv);
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function simulateAIResponse(userInput) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    const input = userInput.toLowerCase();
    
    // Detect if user is asking about a specific creator
    const creatorQuestion = detectCreatorQuestion(input);
    if (creatorQuestion) {
        return generateCreatorResponse(creatorQuestion);
    }
    
    // Default responses based on keywords
    if (input.includes('recommend') || input.includes('suggest')) {
        return generateRecommendationResponse(input);
    } else if (input.includes('gaming') || input.includes('game')) {
        return "The Indian gaming creator space is rapidly growing, with a 45% increase in viewership over the last year. Mobile gaming dominates the Indian market, with BGMI, Free Fire, and Call of Duty Mobile being the most popular games among creators. For brand sponsorships, engagement rates are typically more important than subscriber count - creators with 100K-500K subscribers often have the best engagement metrics.";
    } else if (input.includes('sponsor') || input.includes('brand') || input.includes('partnership')) {
        return "For successful sponsorships with Indian gaming creators, we recommend: 1) Prioritize engagement over subscriber count, 2) Consider the creator's audience demographics, 3) Look for authentic brand alignment, 4) Start with micro-sponsorships to test performance, and 5) Request performance metrics in your agreement. The average sponsorship cost ranges from ₹10,000 for smaller creators to ₹100,000+ for larger ones.";
    } else if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
        return "Hello! I'm your NExura AI assistant. I can help you learn about Indian gaming creators, find the right creators for your brand, understand audience demographics, and provide insights on sponsorship opportunities. What would you like to know?";
    } else {
        return "I'm here to help you with information about Indian gaming creators, their audiences, and sponsorship opportunities. You can ask me about specific creators, game categories, or general trends in the Indian gaming space. For example, try asking 'Who are the top BGMI creators?' or 'What's the typical audience for Minecraft creators in India?'";
    }
}

function detectCreatorQuestion(input) {
    // Check if the user is asking about a creator in our database
    for (const creator of creatorsData) {
        if (input.includes(creator.name.toLowerCase())) {
            return creator;
        }
    }
    return null;
}

function generateCreatorResponse(creator) {
    return `<strong>${creator.name}</strong> is a ${creator.tags.join(', ')} content creator with ${formatNumber(creator.subscribers)} subscribers. 
    
    Their channel focuses primarily on ${creator.description.split('.')[0]}. The audience is predominantly ${creator.audience.includes('teen') ? 'teenage (13-17)' : ''}${creator.audience.includes('youngadult') ? ' and young adult (18-24)' : ''} with an engagement rate of ${creator.engagementRate}%.
    
    Based on their content and audience, they would be a good fit for brands in the ${getRecommendedBrands(creator.tags)} space. The estimated cost for a sponsored integration would be around ₹${creator.estimatedCost}.`;
}

function generateRecommendationResponse(input) {
    // Identify what type of recommendation is being asked for
    let category = 'gaming';
    if (input.includes('bgmi') || input.includes('battlegrounds')) {
        category = 'BGMI';
    } else if (input.includes('minecraft')) {
        category = 'Minecraft';
    } else if (input.includes('gta') || input.includes('grand theft auto')) {
        category = 'GTA V';
    } else if (input.includes('free fire')) {
        category = 'Free Fire';
    } else if (input.includes('call of duty') || input.includes('cod')) {
        category = 'Call of Duty Mobile';
    }
    
    // Filter creators by category
    const relevantCreators = creatorsData.filter(creator => 
        creator.tags.some(tag => tag.toLowerCase().includes(category.toLowerCase()))
    );
    
    // Sort by engagement rate
    relevantCreators.sort((a, b) => b.engagementRate - a.engagementRate);
    
    if (relevantCreators.length === 0) {
        return `I couldn't find any creators specifically for ${category}. Please try a different category or ask for general gaming creators.`;
    }
    
    // Return top 3 creators by engagement
    return `Here are the top ${category} creators I'd recommend based on engagement rate:
    
    1. <strong>${relevantCreators[0]?.name || 'N/A'}</strong> - ${relevantCreators[0]?.engagementRate || 'N/A'}% engagement, ${formatNumber(relevantCreators[0]?.subscribers || 0)} subscribers
    
    2. <strong>${relevantCreators[1]?.name || 'N/A'}</strong> - ${relevantCreators[1]?.engagementRate || 'N/A'}% engagement, ${formatNumber(relevantCreators[1]?.subscribers || 0)} subscribers
    
    3. <strong>${relevantCreators[2]?.name || 'N/A'}</strong> - ${relevantCreators[2]?.engagementRate || 'N/A'}% engagement, ${formatNumber(relevantCreators[2]?.subscribers || 0)} subscribers
    
    These creators have demonstrated strong audience engagement and content quality in the ${category} space. Click on any creator card to see more detailed analytics.`;
}

function getRecommendedBrands(tags) {
    if (tags.includes('BGMI') || tags.includes('Free Fire') || tags.includes('Call of Duty Mobile')) {
        return 'mobile gaming, energy drinks, and tech accessories';
    } else if (tags.includes('Minecraft')) {
        return 'educational tech, creative tools, and family-friendly brands';
    } else if (tags.includes('Valorant') || tags.includes('GTA V')) {
        return 'PC gaming hardware, peripherals, and lifestyle brands';
    } else {
        return 'gaming peripherals, snacks, and apparel';
    }
} 
