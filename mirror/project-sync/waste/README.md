---
source: project-sync
project: waste
original-path: D:\projects\waste\README.md
synced: 2026-08-03
---

# 🌍 Waste Recycling Credit Web App

A future-ready, scalable web application that rewards users for recycling by scanning QR codes on recyclable items. Built with modern technologies and designed to integrate with IoT smart bins.

## 🚀 Features

- **QR Code Scanning**: Scan recyclable items via web camera
- **Credit System**: Earn points based on waste type and environmental impact
- **User Dashboard**: Track credits, impact stats, and earned badges
- **Admin Panel**: Manage users, reward rules, and waste data
- **Analytics Engine**: Real-time environmental impact tracking
- **PWA Support**: Installable on mobile devices
- **IoT-Ready**: Backend API designed for future smart bin integration

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- Redux Toolkit
- React Router
- HTML5 QR Code Scanner
- Recharts for analytics

**Backend:**
- Node.js + Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Redis (optional cache layer)
- AWS S3 (file storage)

### Data Models

- **User**: Profile, points, badges, scan history
- **Item**: QR code, item type, eco impact, reward points
- **Transaction**: Scan logs with location and points
- **RewardRule**: Dynamic reward configuration

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Redis (optional)

### Setup

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Configure backend environment:**
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, etc.
```

3. **Configure frontend environment:**
```bash
cd frontend
cp .env.example .env
# Edit .env with your API URL
```

4. **Run in development:**
```bash
# From root directory
npm run dev
```

Backend runs on `http://localhost:5000`  
Frontend runs on `http://localhost:5173`

## 🔧 Development

### Backend Development
```bash
npm run dev:backend
```

### Frontend Development
```bash
npm run dev:frontend
```

### Build for Production
```bash
npm run build
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/refresh` - Refresh access token

### User Operations
- `GET /api/users/me` - Get current user profile
- `GET /api/users/history` - Get scan history
- `PUT /api/users/profile` - Update profile

### Item Scanning
- `POST /api/items/scan/:qrCode` - Scan and validate QR code

### Admin
- `POST /api/admin/items` - Create/edit waste items
- `GET /api/admin/items` - List all items
- `POST /api/admin/rewards` - Manage reward rules
- `GET /api/admin/users` - List all users

### Analytics
- `GET /api/analytics/global` - Global environmental stats
- `GET /api/analytics/user` - User-specific stats

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Render/Railway)
```bash
cd backend
npm run build
# Deploy with start script
```

### Environment Variables

**Backend (.env):**
```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
REDIS_URL=your_redis_url (optional)
AWS_S3_BUCKET=your_bucket_name (optional)
```

**Frontend (.env):**
```
VITE_API_URL=https://your-backend-url.com
```

## 🔮 Future Enhancements

- [ ] IoT Smart Bin Integration via HTTPS/MQTT
- [ ] GraphQL API for multi-client support
- [ ] Blockchain-based eco-credit ledger
- [ ] Mobile native apps (React Native)
- [ ] Machine learning for waste classification
- [ ] Social features and leaderboards
- [ ] Reward marketplace for redeeming points

## 📊 Scalability Plan

1. **Microservices Architecture**: Split analytics, rewards, and IoT ingestion
2. **Database Optimization**: Sharding and read replicas
3. **Caching Layer**: Redis for sessions and frequent queries
4. **CDN Integration**: CloudFlare for static assets
5. **Load Balancing**: Horizontal scaling with Docker/Kubernetes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

ISC License

## 📞 Support

For issues and questions, please open a GitHub issue.

---

Built with ♻️ for a sustainable future
