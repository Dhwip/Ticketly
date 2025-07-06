#!/bin/bash

echo "🚀 Ticketly Deployment Setup Script"
echo "=================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Git and Node.js are installed"

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit for deployment"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Create .env files if they don't exist
echo "📝 Creating environment files..."

# Backend .env
if [ ! -f "backend/.env" ]; then
    cat > backend/.env << EOF
# Database Configuration
MONGODB_URI=mongodb+srv://Dhwip:your_actual_password@cluster0.qrxo2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DB_PASSWORD=your_actual_password

# Server Configuration
PORT=9000
NODE_ENV=production

# Frontend URL (update after frontend deployment)
FRONTEND_URL=https://your-frontend-domain.vercel.app

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Environment
NODE_ENV=production
EOF
    echo "✅ Created backend/.env (please update with your actual values)"
else
    echo "✅ backend/.env already exists"
fi

# Frontend .env
if [ ! -f "frontend/.env" ]; then
    cat > frontend/.env << EOF
REACT_APP_API_URL=https://your-backend-domain.vercel.app
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
NODE_ENV=production
EOF
    echo "✅ Created frontend/.env (please update with your actual values)"
else
    echo "✅ frontend/.env already exists"
fi

# Test if backend can start
echo "🧪 Testing backend..."
cd backend
if npm install > /dev/null 2>&1; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..

# Test if frontend can build
echo "🧪 Testing frontend..."
cd frontend
if npm install > /dev/null 2>&1; then
    echo "✅ Frontend dependencies installed successfully"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update the .env files with your actual values"
echo "2. Create a GitHub repository and push your code"
echo "3. Follow the DEPLOYMENT_GUIDE.md for detailed deployment instructions"
echo ""
echo "🔗 Useful links:"
echo "- Vercel: https://vercel.com"
echo "- MongoDB Atlas: https://cloud.mongodb.com"
echo "- Stripe: https://stripe.com"
echo ""
echo "📖 Read DEPLOYMENT_GUIDE.md for complete instructions" 