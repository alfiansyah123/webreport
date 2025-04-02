// Data dan fungsi untuk manajemen leads
const dashboardData = {
    reports: 24,
    revenue: 3245,
    clicks: 12489,
    hits: 56342,
    conversions: 0,
    performance: 0,
    conversionData: [
        {id: 'CUNGCUNGPRUT', network: 'iMonetizeit', country: 'United Kingdom', traffic: 'WAP', earning: 921},
        {id: 'CUNGCUNGPRUT', network: 'iMonetizeit', country: 'Canada', traffic: 'WAP', earning: 638},
        {id: 'CUNGCUNGPRUT', network: 'iMonetizeit', country: 'Australia', traffic: 'WAP', earning: 466}
    ]
};

// Update semua komponen dashboard dengan error handling
function updateDashboard() {
    try {
        // Update cards
        const cards = document.querySelectorAll('.card-value');
        if (cards.length >= 4) {
            cards[0].textContent = dashboardData.reports;
            cards[1].textContent = `$${dashboardData.revenue.toLocaleString()}`;
            cards[2].textContent = dashboardData.clicks.toLocaleString();
            cards[3].textContent = dashboardData.hits.toLocaleString();
        }
        
        // Update conversion table
        const tableBody = document.getElementById('conversionTableBody');
        if (tableBody) {
            tableBody.innerHTML = dashboardData.conversionData.map(item => `
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">${item.id}</td>
                    <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">${item.network}</td>
                    <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">${item.country}</td>
                    <td class="px-4 py-3 text-sm text-blue-600 dark:text-blue-400 font-medium">${item.traffic}</td>
                    <td class="px-4 py-3 text-sm text-green-600 dark:text-green-400 font-medium">$${item.earning}</td>
                </tr>
            `).join('');
        }
        
        // Update performance metrics jika ada
        if (typeof updatePerformanceMetrics === 'function') {
            updatePerformanceMetrics();
        }
    } catch (error) {
        console.error('Update dashboard failed:', error);
        // Retry after 5 seconds if network error
        if (error.message.includes('Network')) {
            setTimeout(updateDashboard, 5000);
        }
    }
}

// Fungsi untuk menambah lead baru
function addNewLead(leadData, retryCount = 0) {
    try {
        dashboardData.hits++;
        dashboardData.clicks += leadData.clicks || 1;
        
        if (leadData.converted) {
            dashboardData.conversions++;
            dashboardData.revenue += leadData.value || 0;
        }
        
        dashboardData.performance = Math.round((dashboardData.conversions / dashboardData.hits) * 100);
        dashboardData.reports = dashboardData.hits + dashboardData.conversions;
        
        updateDashboard();
        return dashboardData;
    } catch (error) {
        console.error('Add new lead failed:', error);
        if (retryCount < 3 && error.message.includes('Network')) {
            return addNewLead(leadData, retryCount + 1);
        }
        throw error;
    }
}

// Check network status
function checkNetwork() {
    if (!navigator.onLine) {
        console.warn('Application is offline - will retry when connection is restored');
        window.addEventListener('online', () => {
            console.log('Network connection restored - updating dashboard');
            updateDashboard();
        });
    }
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    updateDashboard();
    checkNetwork();
});