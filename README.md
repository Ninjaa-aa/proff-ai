# Professor AI - AI-Powered Learning Assistant

Professor AI is an intelligent academic assistant that provides personalized learning support through natural language conversations. Built with Next.js 13, MongoDB, and real-time chat capabilities.

## Prerequisites

Before running this project, make sure you have:
- Node.js (v16 or higher)
- MongoDB installed locally or a MongoDB Atlas account
- Python environment for the chat backend (optional if using mock data)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# JWT Authentication
JWT_SECRET=your_jwt_secret_key_min_32_chars

# Admin Access
ADMIN_EMAIL=your_admin_email@example.com

# Optional: Python Backend (if using)
PYTHON_BACKEND_URL=https://zt7rwk6f-5000.inc1.devtunnels.ms
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Credo-InsightAI/professor-ai
cd professor-ai
```

2. Install dependencies with legacy peer deps flag:
```bash
npm install --legacy-peer-deps
```
> Note: The --legacy-peer-deps flag is required due to peer dependency conflicts with framer-motion.

3. Install shadcn/ui components (if not already installed):
```bash
npx shadcn-ui@latest init
```

## Database Setup

1. Make sure MongoDB is running locally or you have a MongoDB Atlas connection string
2. The application will automatically create the required collections on first run

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
professor-ai/
├── app/                    # Next.js 13 app directory
├── components/            # React components
├── lib/                   # Utility functions
├── models/               # MongoDB models
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## Features

- 🔐 Authentication & Authorization
- 💬 Real-time chat with AI
- 📝 Session management
- 🎨 Responsive design
- 🌐 Admin dashboard
- 💰 Subscription plans

## Backend Integration

The chat functionality expects a Python backend running on port 5000. If you're not using the Python backend:

1. The application will fall back to mock data
2. Real-time chat features will be simulated

To set up the Python backend (optional):
1. Set up a Python virtual environment
2. Install required Python packages
3. Run the Flask server

## Common Issues

1. **Framer Motion Peer Dependencies**
   - Use `--legacy-peer-deps` when installing
   - If issues persist, try `npm install framer-motion@latest --legacy-peer-deps`

2. **MongoDB Connection**
   - Ensure MongoDB is running
   - Check connection string in .env
   - Verify network access if using Atlas

3. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Clear browser cookies if testing
   - Check token expiration

## Development Notes

- Uses Next.js 13 App Router
- Implements server-side components
- Includes real-time features with Socket.IO
- Uses Tailwind CSS for styling
- Incorporates shadcn/ui components

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.