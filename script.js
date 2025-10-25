// Crypto Volatility Watcher Frontend JavaScript
class CryptoVolatilityApp {
    constructor() {
        this.apiBaseUrl = 'http://localhost:8000'; // Change this to your API URL
        this.currentPredictions = null;
        this.coins = [];
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.checkApiHealth();
        await this.loadCoins();
        await this.loadPredictions();
        this.setupChartInteractions();
    }

    setupEventListeners() {
        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadPredictions();
        });

        // Chart controls
        document.getElementById('loadChartBtn').addEventListener('click', () => {
            this.loadPriceChart();
        });

        // Feature importance chart
        document.getElementById('featureChart').addEventListener('click', () => {
            this.loadFeatureImportanceChart();
        });

        // Period selector change
        document.getElementById('periodSelector').addEventListener('change', () => {
            if (document.getElementById('coinSelector').value) {
                this.loadPriceChart();
            }
        });
    }

    async checkApiHealth() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/health`);
            const data = await response.json();
            
            if (response.ok) {
                this.updateApiStatus(true, 'Online');
            } else {
                this.updateApiStatus(false, 'Error');
            }
        } catch (error) {
            console.error('API health check failed:', error);
            this.updateApiStatus(false, 'Offline');
        }
    }

    updateApiStatus(isOnline, statusText) {
        const indicator = document.getElementById('statusIndicator');
        const text = document.getElementById('statusText');
        
        indicator.className = `fas fa-circle status-indicator ${isOnline ? 'online' : 'offline'}`;
        text.textContent = statusText;
    }

    async loadCoins() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/coins`);
            if (response.ok) {
                this.coins = await response.json();
                this.populateCoinSelector();
            }
        } catch (error) {
            console.error('Failed to load coins:', error);
        }
    }

    populateCoinSelector() {
        const selector = document.getElementById('coinSelector');
        selector.innerHTML = '<option value="">Select a coin...</option>';
        
        this.coins.forEach(coin => {
            const option = document.createElement('option');
            option.value = coin;
            option.textContent = coin.charAt(0).toUpperCase() + coin.slice(1);
            selector.appendChild(option);
        });
    }

    async loadPredictions() {
        const loadingElement = document.getElementById('loadingPredictions');
        const gridElement = document.getElementById('predictionsGrid');
        const highlightElement = document.getElementById('highlightSection');
        
        // Show loading state
        loadingElement.style.display = 'flex';
        gridElement.style.display = 'none';
        highlightElement.style.display = 'none';

        try {
            const response = await fetch(`${this.apiBaseUrl}/predict`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.currentPredictions = data;
            
            // Update UI
            this.updateLastUpdated();
            this.displayPredictions(data);
            this.displayMostVolatile(data);
            this.updatePredictionDate(data.prediction_date);
            
        } catch (error) {
            console.error('Failed to load predictions:', error);
            this.showError('Failed to load predictions. Please check your API connection.');
        } finally {
            loadingElement.style.display = 'none';
        }
    }

    updateLastUpdated() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        document.getElementById('lastUpdated').textContent = timeString;
    }

    displayPredictions(data) {
        const gridElement = document.getElementById('predictionsGrid');
        gridElement.innerHTML = '';

        if (!data.predictions || data.predictions.length === 0) {
            gridElement.innerHTML = '<p class="text-center">No predictions available</p>';
            gridElement.style.display = 'block';
            return;
        }

        // Sort predictions by volatility probability (highest first)
        const sortedPredictions = [...data.predictions].sort((a, b) => 
            b.volatility_probability - a.volatility_probability
        );

        sortedPredictions.forEach((prediction, index) => {
            const card = this.createPredictionCard(prediction, index === 0);
            gridElement.appendChild(card);
        });

        gridElement.style.display = 'block';
        gridElement.classList.add('fade-in');
    }

    createPredictionCard(prediction, isMostVolatile) {
        const card = document.createElement('div');
        card.className = `prediction-card ${isMostVolatile ? 'most-volatile' : ''}`;
        
        const volatilityPercentage = (prediction.volatility_probability * 100).toFixed(1);
        const volatilityWidth = Math.min(prediction.volatility_probability * 100, 100);
        
        card.innerHTML = `
            <div class="coin-header">
                <span class="coin-name">${prediction.coin}</span>
                <span class="volatility-score">${volatilityPercentage}%</span>
            </div>
            <div class="volatility-bar">
                <div class="volatility-fill" style="width: ${volatilityWidth}%"></div>
            </div>
        `;

        return card;
    }

    displayMostVolatile(data) {
        if (!data.most_volatile_coin || !data.predictions) {
            return;
        }

        const mostVolatilePrediction = data.predictions.find(
            p => p.coin === data.most_volatile_coin
        );

        if (!mostVolatilePrediction) {
            return;
        }

        // Update most volatile coin display
        document.getElementById('mostVolatileCoin').textContent = 
            data.most_volatile_coin.charAt(0).toUpperCase() + data.most_volatile_coin.slice(1);
        
        document.getElementById('mostVolatileScore').textContent = 
            `${(mostVolatilePrediction.volatility_probability * 100).toFixed(1)}%`;

        // Update confidence stats
        this.displayConfidenceStats(data.confidence_stats);

        // Show highlight section
        document.getElementById('highlightSection').style.display = 'block';
    }

    displayConfidenceStats(stats) {
        const container = document.getElementById('confidenceStats');
        container.innerHTML = '';

        if (!stats) return;

        const statsData = [
            { label: 'Mean', value: `${(stats.mean * 100).toFixed(1)}%` },
            { label: 'Min', value: `${(stats.min * 100).toFixed(1)}%` },
            { label: 'Max', value: `${(stats.max * 100).toFixed(1)}%` },
            { label: 'Std Dev', value: `${(stats.std * 100).toFixed(1)}%` }
        ];

        statsData.forEach(stat => {
            const item = document.createElement('div');
            item.className = 'confidence-item';
            item.innerHTML = `
                <div class="confidence-label">${stat.label}</div>
                <div class="confidence-value">${stat.value}</div>
            `;
            container.appendChild(item);
        });
    }

    updatePredictionDate(dateString) {
        if (dateString) {
            const date = new Date(dateString);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            document.getElementById('predictionDate').textContent = formattedDate;
        }
    }

    async loadPriceChart() {
        const coin = document.getElementById('coinSelector').value;
        const period = document.getElementById('periodSelector').value;
        
        if (!coin) {
            this.showError('Please select a coin first.');
            return;
        }

        const chartElement = document.getElementById('priceChart');
        chartElement.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i><span>Loading chart...</span></div>';

        try {
            const response = await fetch(`${this.apiBaseUrl}/plot/${coin}?period=${period}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            
            chartElement.innerHTML = `<img src="${imageUrl}" alt="${coin} ${period} chart" class="chart-image">`;
            
        } catch (error) {
            console.error('Failed to load price chart:', error);
            chartElement.innerHTML = `
                <div class="text-center">
                    <i class="fas fa-exclamation-triangle text-warning"></i>
                    <p>Failed to load chart</p>
                </div>
            `;
        }
    }

    async loadFeatureImportanceChart() {
        const chartElement = document.getElementById('featureChart');
        chartElement.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i><span>Loading chart...</span></div>';

        try {
            const response = await fetch(`${this.apiBaseUrl}/plot/feature_importance`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            
            chartElement.innerHTML = `<img src="${imageUrl}" alt="Feature importance chart" class="chart-image">`;
            
        } catch (error) {
            console.error('Failed to load feature importance chart:', error);
            chartElement.innerHTML = `
                <div class="text-center">
                    <i class="fas fa-exclamation-triangle text-warning"></i>
                    <p>Failed to load chart</p>
                </div>
            `;
        }
    }

    setupChartInteractions() {
        // Add click handlers for chart placeholders
        document.getElementById('priceChart').addEventListener('click', () => {
            if (!document.getElementById('coinSelector').value) {
                this.showError('Please select a coin first.');
            }
        });
    }

    showError(message) {
        // Create a simple error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent-secondary);
            color: white;
            padding: 1rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            max-width: 300px;
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    // Utility method to format numbers
    formatNumber(num, decimals = 2) {
        return parseFloat(num).toFixed(decimals);
    }

    // Method to update API base URL (useful for different environments)
    setApiBaseUrl(url) {
        this.apiBaseUrl = url;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're running on a different domain (for production)
    const isProduction = window.location.hostname !== 'localhost';
    const apiUrl = isProduction ? 'https://cryptoapi.duckdns.org' : 'http://localhost:8000';
    
    const app = new CryptoVolatilityApp();
    app.setApiBaseUrl(apiUrl);
    
    // Make app globally available for debugging
    window.cryptoApp = app;
});

// Add some utility functions for better UX
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading states to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            if (this.id === 'refreshBtn' || this.id === 'loadChartBtn') {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                this.disabled = true;
                
                // Re-enable after a delay (the actual loading will be handled by the app)
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                }, 2000);
            }
        });
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + R to refresh predictions
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        if (window.cryptoApp) {
            window.cryptoApp.loadPredictions();
        }
    }
    
    // Escape to close any open modals/notifications
    if (e.key === 'Escape') {
        const notifications = document.querySelectorAll('.error-notification');
        notifications.forEach(notification => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
    }
});
