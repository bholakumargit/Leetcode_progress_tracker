document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const loginForm = document.getElementById('login-form');
    const loginPage = document.getElementById('login-page');
    const dashboardPage = document.getElementById('dashboard-page');
    const logoutBtn = document.getElementById('logout-btn');
    const usernameInput = document.getElementById('username');
    const displayUsername = document.getElementById('display-username');
    const chillPercentage = document.getElementById('chill-percentage');
    const refreshBtn = document.getElementById('refresh-data');

    // Chart.js instances
    let lineChart;
    let doughnutChart;

    // --- Page Transitions ---
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = usernameInput.value.trim();
        if (username) {
            const originalBtnText = loginForm.querySelector('button').innerHTML;
            loginForm.querySelector('button').innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Syncing...';
            
            try {
                // Fetch real data from a public LeetCode API wrapper
                // Using a more reliable API endpoint
                const response = await fetch(`https://leetcode-api-faisalshohag.vercel.app/stats/${username}`);
                const data = await response.json();

                if (data && data.totalSolved) {
                    displayUsername.textContent = username;
                    
                    // Update Stat Cards
                    document.getElementById('stat-total').textContent = data.totalSolved;
                    document.getElementById('stat-easy').textContent = data.easySolved;
                    document.getElementById('stat-medium').textContent = data.mediumSolved;
                    document.getElementById('stat-hard').textContent = data.hardSolved;
                    document.getElementById('stat-streak').textContent = data.ranking > 100000 ? 'Active' : 'Pro';

                    // Transition to dashboard
                    loginPage.classList.remove('active');
                    
                    setTimeout(() => {
                        dashboardPage.classList.add('active');
                        initCharts(data);
                        // Chill level based on acceptance rate
                        const chillScore = Math.floor(parseFloat(data.acceptanceRate) || 75);
                        animateCounter(chillPercentage, 0, chillScore, 1500);
                    }, 50);
                } else {
                    alert('User not found. Please check the username and try again.');
                    loginForm.querySelector('button').innerHTML = originalBtnText;
                }
            } catch (error) {
                console.error('Fetch error:', error);
                alert('Connection issue. Entering Demo Mode instead.');
                
                // Fallback to demo mode for visual verification
                displayUsername.textContent = username;
                loginPage.classList.remove('active');
                setTimeout(() => {
                    dashboardPage.classList.add('active');
                    initCharts();
                    animateCounter(chillPercentage, 0, 84, 1500);
                }, 50);
            }
        }
    });

    logoutBtn.addEventListener('click', () => {
        dashboardPage.classList.remove('active');
        setTimeout(() => {
            loginPage.classList.add('active');
            usernameInput.value = '';
        }, 50);
    });

    refreshBtn.addEventListener('click', () => {
        const originalText = refreshBtn.innerHTML;
        refreshBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Refreshing...';
        refreshBtn.disabled = true;

        setTimeout(() => {
            refreshBtn.innerHTML = originalText;
            refreshBtn.disabled = false;
            // Re-animate the counter for effect
            const currentVal = parseInt(chillPercentage.textContent);
            animateCounter(chillPercentage, 0, currentVal, 1000);
        }, 1500);
    });

    // --- Counter Animation ---
    
    function animateCounter(element, start, end, duration) {
        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value + '%';
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        }
        window.requestAnimationFrame(step);
    }

    // --- Charts Initialization ---

    function initCharts(realData = null) {
        // Default demo data
        let solvedData = [5, 8, 6, 12, 9, 15, 11];
        let distribution = [120, 180, 40];

        if (realData) {
            distribution = [realData.easySolved, realData.mediumSolved, realData.hardSolved];
            // Normalize graph for smaller counts if necessary
            solvedData = solvedData.map(v => Math.max(1, Math.floor(v * (realData.totalSolved / 300))));
        }

        // Line Chart
        const lineCtx = document.getElementById('lineChart').getContext('2d');
        if (lineChart) lineChart.destroy();
        lineChart = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Solved',
                    data: solvedData,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.05)',
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: '#6366f1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: '#f0f0f0' },
                        ticks: { font: { family: 'Urbanist', size: 10 } }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { font: { family: 'Urbanist', size: 10 } }
                    }
                }
            }
        });

        // Doughnut Chart
        const doughnutCtx = document.getElementById('doughnutChart').getContext('2d');
        if (doughnutChart) doughnutChart.destroy();
        doughnutChart = new Chart(doughnutCtx, {
            type: 'doughnut',
            data: {
                labels: ['Easy', 'Medium', 'Hard'],
                datasets: [{
                    data: distribution,
                    backgroundColor: ['#00c49f', '#ffbb28', '#ff4d4f'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            font: { family: 'Urbanist', weight: '600', size: 11 }
                        }
                    }
                }
            }
        });
    }
});
