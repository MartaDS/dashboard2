# Cancer Charity Market — Ad Spend Dashboard

Nielsen advertising spend analysis for the UK cancer charity market, Aug 2024 – Jul 2025.

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Install & Run

```bash
# Install dependencies
npm install

# Start development server (opens at http://localhost:5173)
npm run dev
```

### Build for Production

```bash
# Build optimised static files into /dist
npm run build

# Preview the production build locally
npm run preview
```

## Deployment

The `npm run build` command produces a `/dist` folder of static files that can be deployed to any static hosting service:

| Platform | Command / Notes |
|----------|----------------|
| **Netlify** | Drag & drop the `/dist` folder at netlify.com/drop, or connect your repo and set build command to `npm run build`, publish dir to `dist` |
| **Vercel** | `npx vercel` in the project root — it auto-detects Vite |
| **GitHub Pages** | Push `/dist` to `gh-pages` branch, or use the `gh-pages` npm package |
| **AWS S3 + CloudFront** | Upload `/dist` contents to an S3 bucket with static website hosting enabled |
| **Any web server** | Copy `/dist` to your server's public HTML directory (Apache, Nginx, etc.) |

## Project Structure

```
dashboard-app/
├── index.html          # HTML entry point
├── vite.config.js      # Vite configuration
├── package.json        # Dependencies & scripts
└── src/
    ├── main.jsx        # React root mount
    ├── index.css       # Global reset styles
    └── Dashboard.jsx   # Main dashboard component (all data + charts)
```

## Data

All data is embedded in `src/Dashboard.jsx`. To update:
- Edit the constants at the top of the file (`MEDIA_DATA`, `TOP_ADVERTISERS`, `MONTHLY_TOTALS`, `TOP5_MONTHLY`)
- No backend or API required — fully static

## Tech Stack

- [React 18](https://react.dev/)
- [Recharts](https://recharts.org/) — chart library
- [Vite](https://vitejs.dev/) — build tool
