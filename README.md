# SoulSync - AI-Powered Mental Wellness Platform 🧠

SoulSync is a comprehensive mental wellness platform that leverages artificial intelligence, wearable technology, and cloud infrastructure to provide personalized mental health support. The platform combines cutting-edge technology with therapeutic approaches to create an intelligent, responsive environment for mental wellness.

## 🌟 Key Features

### 1. AI-Powered Intelligent Chat Support

- Advanced chatbot using RAG (Retrieval Augmented Generation) with Pinecone and Langchain
- Trained on extensive therapeutic literature
- Context-aware responses with memory retention
- Crisis resource recommendations

### 2. Smart Wellness Analytics

- ML model trained on 1 million+ data points
- Real-time stress level prediction using wearable data
- Comprehensive mood analytics dashboard
- Integration with fitness wearables

### 3. Emotion Detection System

- Real-time emotion recognition using Face++ API
- Photo-based emotion analysis
- Mood tracking and historical analysis
- Personalized recommendations based on emotional states

### 4. Daily Affirmations Service

- AWS SNS-powered daily affirmation delivery
- Personalized motivation messages
- Customizable delivery schedule
- AWS Lambda-based message processing

### 5. Resource Center

- Curated health articles
- Wellness challenges with progress tracking
- Interactive todo list with Google Calendar integration
- Music therapy sessions
- Guided meditation resources

### 6. Community Features

- Group therapy sessions
- Peer support network
- Anonymous posting option
- Moderated discussions

### 7. Comprehensive Profile Management

- Notification preferences
- Anonymity settings
- Data export functionality
- Account management (deletion, password reset)
- Privacy controls

## 🚀 Technology Stack

### Frontend

- React.js with Vite
- Next UI Component Library
- TailwindCSS
- Deployed on Vercel
- CI/CD by vercel

### Backend

- Node.js & Express.js
- Deployed on Google Cloud Run
- Docker containerization
- CI/CD pipeline integration

### Authentication

- Firebase Authentication
- Multiple sign-in options:
  - Google OAuth
  - Facebook Login
  - Twitter Login
  - Email/Password

### AI/ML Infrastructure

- Two specialized ML models deployed on Google Cloud Run:
  - Therapeutic Chatbot (RAG-based)
  - Stress/Mood Prediction Model
- Docker containers for model serving
- Automated CI/CD pipeline for model deployment

### Cloud Services

- Google Cloud Run for backend and ML models
- AWS SNS & Lambda for affirmations service
- Firebase for authentication
- Pinecone for vector storage
- MongoDB for database

### APIs and Integrations

- Face++ API for emotion detection
- Google Calendar API
- Wearable device APIs
- Social media authentication APIs

## 🛠️ Installation

### Prerequisites

- Node.js (v14 or higher)
- Docker
- Google Cloud CLI
- Firebase CLI

### Local Development Setup

```bash
# Clone repository
git clone https://github.com/Chirag-Punia/SoulSync-V2

# Install dependencies
cd client
npm install

cd ../server
npm install
```

### Environment Variables

#### Frontend (.env)

```
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# API Configuration
VITE_API_BASE_URL=http://localhost:5002/api

# Face++ API Configuration
VITE_FACE_API_KEY=your_face_api_key
VITE_FACE_API_SECRET=your_face_api_secret
```

#### Backend (.env)

```
# MongoDB Configuration
MONGO_URI=your_mongodb_connection_string

# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CLIENT_FALLBACK=http://localhost:5002/api/gfit/auth/callback

# Fitbit Configuration
FITBIT_AUTH_URL=https://www.fitbit.com/oauth2/authorize
FITBIT_TOKEN_URL=https://api.fitbit.com/oauth2/token
CLIENT_ID=your_fitbit_client_id
CLIENT_SECRET=your_fitbit_client_secret
REDIRECT_URI=your_redirect_uri

# Client Configuration
CLIENT_URL=http://localhost:5173

# AWS Configuration
AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_SNS_TOPIC_ARN=your_sns_topic_arn
AWS_LAMBDA_WELCOME_FUNCTION=your_lambda_function_name

# ML Model API
FLASK_API_URL=your_flask_api_url
```

## 🚀 Deployment

### Frontend (Vercel)

- Automatic deployment through Vercel's GitHub integration
- Environment variables configured in Vercel dashboard

### Backend (Google Cloud Run)

```bash
# Build and deploy
gcloud builds submit --tag gcr.io/project-id/soulsync-backend
gcloud run deploy soulsync-backend --image gcr.io/project-id/soulsync-backend
```

### ML Models (Google Cloud Run)

- Separate containers for each model
- Automated deployment through Cloud Build triggers

### Checkout Our models
- ChatBot : https://github.com/Chirag-Punia/mental-health-app-model
- Wearables analyser: https://github.com/Chirag-Punia/wearablesMood

## 🔒 Security Features

- End-to-end encryption
- Firebase Authentication
- Protected API endpoints
- CORS protection
- Data Anonymization options

## 📊 Data Privacy

- GDPR compliant
- Data export functionality
- Account deletion option
- Anonymous mode available
- Secure data storage

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🆘 Support

For support, please create an issue in the repository or contact our support team at support@soulsync.com

## 📁 Project Structure

```
soulsync/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── context/        # Context management
│   │   └── assets/        # Asset management
│   └── public/           # Static assets
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── middleware/   # middleware functions
----------------------------------------------------------
```

## 🏃‍♂️ Start Commands

### Frontend Development

```bash
cd client
npm run dev        # Starts development server on port 5173
npm run build      # Creates production build
npm run preview    # Preview production build
```

### Backend Development

```bash
cd server
nodemon index.js        # Starts development server with nodemon
node index.js      # Starts production server
```

## 🏃‍♀️ Fitness Data Integration

SoulSync allows you to connect and sync your fitness data from multiple sources:

### Google Fit Integration

- Steps, activity, and sleep data
- Heart rate monitoring
- Real-time sync with Google Fit API
- Historical data import
- Connect via Google OAuth

### Fitbit Integration

- Detailed sleep analysis
- Continuous heart rate monitoring
- Stress score tracking
- Activity and exercise logs
- Connect through Fitbit OAuth

To connect your fitness accounts:

1. Navigate to Dashboard Settings
2. Choose Google Fit or Fitbit
3. Complete the OAuth authorization process
4. Your data will automatically sync every 30 minutes

## 🔮 Future Improvements

### Enhanced AI Capabilities

- Integration with GPT-4 for more nuanced therapeutic conversations
- Multi-language support with advanced translation models
- Sentiment analysis for written journal entries

### Extended Platform Features

- Virtual Reality (VR) guided meditation sessions
- Augmented Reality (AR) mood visualization
- Integration with Apple Health and Samsung Health
- Advanced journaling with AI-powered insights

### Technical Enhancements

- Migration to TypeScript for improved type safety
- Implementation of GraphQL for optimized data fetching
- Enhanced offline functionality using Service Workers
- WebSocket integration for real-time features
- Automated testing pipeline with Jest and Cypress

### Community Features

- Mentor-mentee matching system
- Professional therapist marketplace
- Community-driven content moderation
- Gamification elements for engagement
- Support group scheduling system

---

Built with ❤️ for mental wellness
