# SmartStore AI - AI E-commerce Admin Assistant

An AI-powered platform where store owners manage products and get AI-generated descriptions, SEO tags, marketing captions, and sales insights.

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Chart.js (react-chartjs-2)
- React Router DOM
- Axios

### Backend
- Express.js
- MongoDB (Mongoose)
- JWT + bcrypt (Authentication)
- Google Gemini API (AI Content Generation)

## Features

- **User Authentication** - Signup/Login with JWT tokens
- **Product Management** - Add, edit, delete products with full CRUD
- **AI Content Generation** - Auto-generate product descriptions, SEO tags, and marketing captions using Gemini AI
- **Sales Dashboard** - Revenue analytics, top products chart, category breakdown
- **AI Sales Suggestions** - Pricing recommendations and trending insights
- **Inventory Alerts** - Low stock detection and warnings

## Project Structure

```
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handlers (auth, product, AI, sales)
│   ├── middleware/       # JWT authentication middleware
│   ├── models/          # Mongoose schemas (User, Product, Sale)
│   ├── routes/          # API route definitions
│   └── server.js        # Express entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components (Sidebar)
│   │   ├── context/     # Auth context provider
│   │   └── pages/       # Dashboard, Products, AIGenerator, Sales, Login, Signup
│   └── vite.config.js   # Vite configuration with API proxy
```

## Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Google Gemini API key

### Backend Setup
```bash
cd backend
npm install
# Create .env file with MONGODB_URI, JWT_SECRET, GEMINI_API_KEY
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/products | Get all products |
| POST | /api/products | Create product |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |
| POST | /api/ai/description | Generate product description |
| POST | /api/ai/seo-tags | Generate SEO tags |
| POST | /api/ai/caption | Generate marketing caption |
| GET | /api/ai/suggestions | Get AI sales suggestions |
| POST | /api/sales | Record a sale |
| GET | /api/sales/dashboard | Get dashboard analytics |

## Deployment

- **Backend**: Deployed on Render (Web Service)
- **Frontend**: Deployed on Render (Static Site)
