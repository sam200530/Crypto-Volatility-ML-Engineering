# Crypto Volatility Watcher - Frontend

A modern, responsive web interface for the Crypto Volatility Watcher machine learning application.

## Features

### 🎨 Modern Dark Theme Design
- Sleek dark theme with gradient accents
- Responsive design that works on all devices
- Smooth animations and transitions
- Professional typography using Inter font

### 📊 Real-time Predictions Display
- Live volatility predictions for all cryptocurrencies
- Highlighted most volatile coin of the day
- Confidence statistics and model metrics
- Auto-refresh functionality

### 📈 Interactive Charts
- Price charts for individual cryptocurrencies (1d, 30d, 1y)
- Feature importance visualization
- Click-to-load chart functionality
- High-quality PNG chart rendering

### 🔧 API Integration
- Connects to FastAPI backend
- Health monitoring and status indicators
- Error handling and user feedback
- Automatic API URL detection (local vs production)

## File Structure

```
├── index.html          # Main HTML structure
├── styles.css          # Dark theme CSS with responsive design
├── script.js           # JavaScript for API integration and interactivity
└── README_FRONTEND.md  # This documentation
```

## Setup Instructions

### 1. Local Development

1. **Start your FastAPI backend:**
   ```bash
   uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
   ```

2. **Open the frontend:**
   - Simply open `index.html` in your web browser
   - Or serve it using a local server:
   ```bash
   # Using Python
   python -m http.server 3000
   
   # Using Node.js
   npx serve .
   ```

3. **Access the application:**
   - Local: `http://localhost:3000`
   - Backend API: `http://localhost:8000`

### 2. Production Deployment

The frontend automatically detects the production environment and connects to:
- **Backend API:** `https://cryptoapi.duckdns.org`
- **Frontend:** Deploy to any static hosting service (Vercel, Netlify, etc.)

## API Endpoints Used

The frontend integrates with these FastAPI endpoints:

- `GET /health` - API health check
- `GET /coins` - List of supported cryptocurrencies
- `GET /predict` - Latest volatility predictions
- `GET /plot/{coin}?period={period}` - Price charts
- `GET /plot/feature_importance` - Feature importance chart

## Key Features Explained

### Prediction Cards
- Each cryptocurrency gets a prediction card showing volatility probability
- Most volatile coin is highlighted with special styling
- Progress bars visualize volatility levels
- Responsive grid layout adapts to screen size

### Chart Integration
- Dropdown selectors for coin and time period
- Lazy loading of charts (only when requested)
- Error handling for missing charts
- High-quality image rendering

### Responsive Design
- Mobile-first approach
- Breakpoints at 768px and 480px
- Flexible grid layouts
- Touch-friendly interface elements

### User Experience
- Loading states and animations
- Error notifications with auto-dismiss
- Keyboard shortcuts (Ctrl+R to refresh)
- Smooth scrolling and transitions

## Customization

### Changing API URL
```javascript
// In script.js, modify the constructor
this.apiBaseUrl = 'https://your-api-domain.com';
```

### Styling Modifications
- Edit `styles.css` to change colors, fonts, or layout
- CSS custom properties (variables) make theme changes easy
- All colors are defined in the `:root` selector

### Adding New Features
- Extend the `CryptoVolatilityApp` class in `script.js`
- Add new HTML sections in `index.html`
- Style new components in `styles.css`

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance Features

- Lazy loading of charts
- Efficient DOM updates
- Minimal API calls
- Optimized animations
- Responsive images

## Security Considerations

- CORS enabled for cross-origin requests
- No sensitive data stored in frontend
- API endpoints are read-only
- Input validation on client side

## Troubleshooting

### Common Issues

1. **Charts not loading:**
   - Ensure backend is running
   - Check API health status indicator
   - Verify plot files exist in `/plots` directory

2. **CORS errors:**
   - Backend has CORS middleware enabled
   - Check API URL configuration

3. **Predictions not updating:**
   - Run the prediction pipeline first
   - Check for prediction files in `/data` directory

### Debug Mode
Open browser developer tools and access:
```javascript
// Global app instance for debugging
window.cryptoApp
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on multiple devices/browsers
5. Submit a pull request

## License

This project is part of the Crypto Volatility Watcher application.
