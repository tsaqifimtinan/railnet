<p align="center">
  <a href="#railnet">
    <div style="font-size: 96px;">🚄</div>
    <h3 align="center">Railnet</h3>
  </a>
</p>

<p align="center">A modern rail network booking system built with Next.js and Flask, featuring the Jakarta MRT network with smart route planning.</p>

<br/>

## About Railnet

Railnet is a comprehensive train booking and route planning application that simulates the Jakarta MRT (Mass Rapid Transit) system. The app helps users find optimal routes between stations, view train schedules, and manage their ticket bookings.

### Key Features

- **Smart Route Planning**: Uses Dijkstra's algorithm to find the shortest routes and BFS for minimum transfers
- **Real-time Schedule Display**: Interactive train schedules across Blue, Red, and Green lines
- **Ticket Management**: Book, view, and manage train tickets with different fare types
- **Multi-line Network**: Supports the complete Jakarta MRT network with transfer stations
- **Modern UI**: Clean, responsive design with line-specific color coding

### How It Works

**Frontend (Next.js)**:
- Interactive route finder with station selection
- Train schedule viewer with line and direction filters  
- Ticket booking and management system
- Real-time route visualization

**Backend (Flask API)**:
- Graph-based route calculation using advanced algorithms
- Network analysis and optimization
- RESTful API endpoints for route planning
- Coordinate-based distance calculations

The Flask API is integrated into the Next.js app through API routes and can be deployed as serverless functions.

## How to Use Railnet

### 1. Plan Your Route
- Visit the homepage and select your departure and arrival stations
- Choose your travel date
- Click "Search Trains" to find optimal routes
- View both shortest distance and minimum transfer options

### 2. Check Train Schedules  
- Navigate to the "Schedule" page
- Select your line (Blue, Red, or Green) and direction
- View detailed timetables for all trains on that route
- See transfer stations and connection information

### 3. Book and Manage Tickets
- Go to "Route & Tickets" to view your bookings
- Filter tickets by status (Upcoming, Completed, Cancelled)
- Each ticket includes PNR, route details, and pricing
- Cancel upcoming tickets if needed

### 4. Navigate the Network
The Jakarta MRT network consists of:
- **Blue Line**: Main north-south corridor (Lebak Bulus → Bundaran HI)
- **Red Line**: East branch connecting to Blue Line at Istora Mandiri
- **Green Line**: West branch connecting to Blue Line at ASEAN station

## Demo

Try the live demo: [Railnet Demo](https://railnet-frontend.vercel.app/)

## Technical Architecture

### Frontend Stack
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Responsive styling
- **React Components**: Interactive UI elements

### Backend Stack  
- **Flask**: Python web framework
- **Graph Algorithms**: Dijkstra's and BFS for optimal routing
- **CORS Support**: Cross-origin resource sharing
- **Serverless Ready**: Deployable on Vercel Functions

### API Endpoints
- `POST /api/shortest-route`: Find optimal routes between stations
- `GET /api/network-analysis`: Analyze entire network statistics
- `GET /api/python`: Health check endpoint

## Local Development

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Python 3.8+ with pip

### Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd railnet
```

2. **Install frontend dependencies**
```bash
npm install
# or
yarn install
# or  
pnpm install
```

3. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

4. **Start the development servers**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

This starts:
- Next.js frontend on [http://localhost:3000](http://localhost:3000)  
- Flask API server on [http://127.0.0.1:5328](http://127.0.0.1:5328)

### Development Notes
- The Flask server is automatically proxied through Next.js via `next.config.js`
- API routes are accessible at `/api/*` and mapped to the Flask backend
- Hot reloading works for both frontend and backend changes
- Backend logs appear in the terminal running the dev command

## Deployment

### Deploy to Vercel
1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Vercel
3. Vercel automatically detects the Next.js + Python setup
4. Your Flask API becomes serverless functions in production

### Environment Configuration
- Frontend deploys as static Next.js pages
- Backend deploys as Python serverless functions
- No additional configuration needed for basic deployment

## Project Structure

```
railnet/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage with route finder
│   ├── schedule/          # Train schedules page  
│   └── route-tickets/     # Ticket management page
├── api/                   # Flask backend
│   ├── index.py          # Main API routes and algorithms
│   └── requirements.txt   # Python dependencies
├── public/               # Static assets
├── next.config.js       # Next.js configuration & API proxy
└── package.json         # Frontend dependencies
```

## Learn More

### Technologies Used
- [Next.js Documentation](https://nextjs.org/docs) - React framework with App Router
- [Flask Documentation](https://flask.palletsprojects.com/) - Python web framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript

### Algorithms Implemented
- **Dijkstra's Algorithm**: Finds shortest path by distance between stations
- **Breadth-First Search (BFS)**: Finds route with minimum transfers
- **Graph Theory**: Models the MRT network as a weighted graph
- **Euclidean Distance**: Calculates real-world distances using coordinates

## Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is open source and available under the [MIT License](LICENSE).
