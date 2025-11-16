# CaddyWizardAI

AI-powered golf caddie assistant providing instant shot recommendations and club selection advice.

## Overview

CaddyWizardAI is an intelligent golf caddie assistant that uses Claude AI to provide data-driven shot recommendations. Simply input your shot scenario (distance, lie, obstacles) and get expert caddie advice powered by artificial intelligence.

## Features

### Current Features
- 🤖 **AI Shot Recommendations**: Get instant club and strategy suggestions using Claude AI, personalized to your club bag
- 🏌️ **Golf Profile Management**: Save your clubs and average distances for personalized recommendations
- 📊 **Shot History**: Track and review your past shots and AI recommendations
- 📈 **Performance Analytics**: Analyze your game with statistics on lie types, distances, and club usage
- 👤 **User Authentication**: Secure account system with Google OAuth support
- 💾 **Data Persistence**: MongoDB storage for user profiles and shot history

### Planned Features
- 🏌️ **Round Recording**: Track complete rounds with scorecard integration
- 📤 **Data Export**: Export your shot history and analytics
- 🗺️ **Course Integration**: Add satellite imagery and course mapping
- 🌤️ **Weather Integration**: Factor in wind and weather conditions
- 📱 **Mobile App**: Native mobile experience

## How It Works

1. **Create Profile**: Set up your golf bag with club distances and handicap
2. **Input Shot Details**: Enter distance to target, current lie, and any obstacles
3. **AI Analysis**: Claude AI analyzes the scenario using your profile data and generates personalized recommendations
4. **Get Advice**: Receive club selection (from your bag), strategy, and reasoning
5. **Track Results**: Record shot outcomes to build your history and analyze performance

## Current Implementation

CaddyWizardAI uses:
- **Claude AI** (Anthropic) for intelligent shot recommendations
- **User profiles** to store club data and preferences
- **Simple input form** for shot scenarios without requiring GPS or complex data

## Tech Stack

**Frontend:**
- React 19 with Vite
- Chakra UI for components
- React Router for navigation

**Backend:**
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT authentication
- Anthropic Claude AI API

**Infrastructure:**
- Docker & Docker Compose
- MongoDB container
- Sentry for error tracking

## Installation

### Prerequisites
- Node.js 18+
- MongoDB
- Claude API key (from Anthropic)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/mn1685/boiler-plate.git
cd boiler-plate
```

2. **Install dependencies**
```bash
npm install
cd server && npm install && cd ..
```

3. **Configure environment variables**

Create `.env` file in the server directory:
```env
MONGODB_URI=mongodb://localhost:27017/caddywizardai
CLAUDE_KEY=your_claude_api_key
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

4. **Start the application**

Development mode:
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

Using Docker:
```bash
docker-compose up
```

## Usage

1. **Sign up** at `/signup` or use Google OAuth
2. **Set up your golf profile** at `/golf-profile`:
   - Add your clubs (Driver, irons, wedges, etc.)
   - Enter average distances for each club
   - Optional: Add your handicap
3. **Get shot recommendations** at `/shot`:
   - Enter distance to target
   - Select your lie (tee, fairway, rough, sand, etc.)
   - Describe any obstacles or hazards
   - Click "Get AI Recommendation"
4. **Review the AI advice**: Club selection, strategy, and reasoning

## Architecture

```
┌─────────────────────┐
│   React Frontend    │
│   (Vite + Chakra)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Express API Server │
│    (Node.js)        │
└──────────┬──────────┘
           │
    ┌──────┴──────┬──────────────┐
    ▼             ▼              ▼
┌─────────┐  ┌──────────┐  ┌──────────┐
│ MongoDB │  │ Claude   │  │   Auth   │
│Database │  │   AI     │  │  (JWT)   │
└─────────┘  └──────────┘  └──────────┘
```

## Project Structure

```
boiler-plate/
├── src/                    # React frontend
│   ├── App.jsx            # Main app component
│   ├── ShotRecommendation.jsx  # Shot advice UI
│   ├── GolfProfile.jsx    # Profile management
│   └── ...
├── server/                # Node.js backend
│   ├── index.js          # Express server
│   ├── golf.js           # Golf recommendation routes
│   ├── models/           # MongoDB models
│   │   ├── Shot.js
│   │   ├── GolfProfile.js
│   │   └── User.js
│   └── middleware/       # Auth middleware
└── docker-compose.yml    # Container configuration
```

## Development Roadmap

### Phase 1: Core Features ✅
- [x] Set up project structure and tech stack
- [x] Implement AI shot recommendations
- [x] Build golf profile system
- [x] User authentication with JWT
- [x] Basic UI/UX with Chakra

### Phase 2: Enhanced Features (In Progress)
- [x] Shot history tracking
- [x] Performance analytics dashboard
- [x] Club recommendations based on user's bag
- [ ] Round recording feature
- [ ] Export shot data

### Phase 3: Advanced Features
- [ ] GPS integration for course location
- [ ] Weather API integration
- [ ] Course database with satellite imagery
- [ ] Social features (share rounds, compare stats)
- [ ] Mobile app (React Native)

### Phase 4: Pro Features
- [ ] PGA Tour strokes gained data integration
- [ ] Advanced analytics and trends
- [ ] Handicap tracking and improvement insights
- [ ] Tournament mode
- [ ] AI coaching tips

## Contributing

Contributions are welcome! This project is in early development.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/google` - Google OAuth login
- `GET /api/profile` - Get user profile

### Golf Features
- `GET /api/golf/profile` - Get user's golf profile
- `POST /api/golf/profile` - Save/update golf profile
- `POST /api/golf/recommend` - Get AI shot recommendation (personalized with user's club data if authenticated)
- `POST /api/golf/shots` - Save shot to history
- `GET /api/golf/shots` - Get user's shot history
- `DELETE /api/golf/shots/:id` - Delete a shot from history
- `GET /api/golf/analytics` - Get performance analytics and statistics

### Request Example
```bash
curl -X POST http://localhost:3000/api/golf/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "distance": 150,
    "lie": "fairway",
    "obstacle": "Water hazard 20 yards ahead"
  }'
```

## Data Privacy

CaddyWizardAI respects user privacy:
- User data is encrypted and stored securely in MongoDB
- AI recommendations are processed via Anthropic's Claude API
- Personal golf profiles and statistics remain private
- No data is shared with third parties without consent
- Optional Google OAuth for convenient authentication

## License

MIT License - See LICENSE file for details

## Acknowledgments

- Anthropic for Claude AI API
- Golf community for feedback and support
- Open source contributors
