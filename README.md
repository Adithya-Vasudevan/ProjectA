# RidePulse NYC 🚴‍♂️

A live, interactive dashboard for New York City's Citi Bike sharing system. Built with React, featuring real-time data visualization, interactive maps, and comprehensive analytics.

![RidePulse NYC Dashboard](https://img.shields.io/badge/Live%20Dashboard-RidePulse%20NYC-blue?style=for-the-badge)

## ✨ Features

- **Real-time Data**: Live updates from Citi Bike GBFS endpoints every 30 seconds
- **Interactive Map**: Station locations with availability indicators using Leaflet
- **Rich Analytics**: Charts and visualizations powered by Recharts
- **Data History**: Stores up to 20 recent snapshots in localStorage
- **Responsive Design**: Beautiful UI with Tailwind CSS and dark mode support
- **Smooth Animations**: Enhanced user experience with Framer Motion
- **Sidebar Navigation**: Intuitive interface with multiple dashboard views

## 🛠 Tech Stack

- **Frontend**: React 18.2.0, Vite 5.4.0
- **Styling**: Tailwind CSS 3.4.10
- **Charts**: Recharts 2.12.7
- **Maps**: React Leaflet 4.2.1, Leaflet 1.9.4
- **Animations**: Framer Motion 11.0.0
- **State Management**: Zustand 4.5.2
- **UI Components**: React CountUp, React Confetti
- **Build Tools**: PostCSS, Autoprefixer

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18 (specified in package.json engines)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ProjectA
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 📊 Dashboard Views

### Overview
- Quick system metrics and statistics
- Top performing stations
- System utilization indicators
- Real-time status updates

### Station Map
- Interactive map of all Citi Bike stations
- Color-coded availability indicators
- Station details in popups
- Filter by station status

### Analytics
- Time series charts of bike/dock availability
- System utilization trends
- Station distribution analytics
- Performance metrics over time

### History
- Historical data snapshots (last 20 updates)
- Trend analysis and comparisons
- Peak utilization tracking
- Data collection timeline

## 🌐 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the Vite configuration
3. Deploy with default settings

The app is optimized for Vercel deployment with:
- Static file optimization
- Automatic HTTPS
- Global CDN distribution
- Environment variable support

### Other Platforms

The built application is a static SPA that can be deployed on:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

## 📡 Data Sources

The application exclusively uses Citi Bike's GBFS (General Bikeshare Feed Specification) endpoints:

- **Station Information**: `https://gbfs.citibikenyc.com/gbfs/2.3/en/station_information.json`
- **Station Status**: `https://gbfs.citibikenyc.com/gbfs/2.3/en/station_status.json`

Data is fetched every 30 seconds and cached locally for performance.

## 🎨 Design Features

- **Theme Support**: Light/dark mode toggle
- **Responsive Layout**: Mobile-first design approach
- **Accessibility**: WCAG compliant color schemes
- **Performance**: Optimized bundle size and lazy loading
- **Error Handling**: Graceful error states and retry mechanisms

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/          # React components
│   ├── tabs/           # Dashboard tab components
│   ├── Dashboard.jsx   # Main dashboard container
│   ├── Sidebar.jsx     # Navigation sidebar
│   └── ...
├── hooks/              # Custom React hooks
├── services/           # API and data services
├── stores/             # Zustand state management
├── utils/              # Utility functions
└── index.css          # Global styles
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🚀 Live Demo

Experience RidePulse NYC live at: [Your Deployment URL]

---

**RidePulse NYC** - Bringing the pulse of urban mobility to your fingertips 🗽