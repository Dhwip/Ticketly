# 🚀 Ticketly Deployment Guide - Vercel

## Prerequisites
- Vercel account (free at vercel.com)
- GitHub repository connected to Vercel
- MongoDB Atlas database
- Stripe account (for payments)

## 📋 Step-by-Step Deployment

### Step 1: Deploy Backend API

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your GitHub repository (Ticketly)**
4. **Configure Backend Project:**
   ```
   Framework Preset: Node.js
   Root Directory: backend
   Build Command: (leave empty)
   Output Directory: (leave empty)
   Install Command: npm install
   ```

5. **Add Environment Variables:**
   ```
   pass = [Your MongoDB Password]
   FRONTEND_URL = [Your Frontend URL - add after frontend deployment]
   STRIPE_SECRET_KEY = [Your Stripe Secret Key]
   JWT_SECRET = [Your JWT Secret - if you have one]
   NODE_ENV = production
   ```

6. **Click "Deploy"**
7. **Copy the deployment URL** (e.g., `https://ticketly-backend-xyz.vercel.app`)

### Step 2: Deploy Frontend

1. **Go back to Vercel Dashboard**
2. **Click "New Project" again**
3. **Import the same GitHub repository**
4. **Configure Frontend Project:**
   ```
   Framework Preset: Create React App
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

5. **Add Environment Variables:**
   ```
   REACT_APP_API_URL = [Your Backend URL from Step 1]
   REACT_APP_STRIPE_PUBLISHABLE_KEY = [Your Stripe Publishable Key]
   ```

6. **Click "Deploy"**
7. **Copy the frontend URL**

### Step 3: Update Environment Variables

1. **Go back to your Backend project settings**
2. **Update the FRONTEND_URL** with your frontend URL
3. **Redeploy the backend** if needed

## 🔧 Configuration Files

### Backend (backend/vercel.json)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/app.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Frontend Configuration (frontend/src/config/config.js)
```javascript
const config = {
  development: {
    apiUrl: 'http://localhost:9000',
    stripePublishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
  },
  production: {
    apiUrl: process.env.REACT_APP_API_URL,
    stripePublishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
  }
};
```

## 🌐 URLs Structure

After deployment, you'll have:
- **Backend**: `https://ticketly-backend-xyz.vercel.app`
- **Frontend**: `https://ticketly-frontend-xyz.vercel.app`

## 🔍 Testing Your Deployment

1. **Test Backend**: Visit `https://your-backend-url.vercel.app/test`
2. **Test Frontend**: Visit your frontend URL
3. **Test API Calls**: Check browser console for any CORS or connection errors

## 🛠️ Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure FRONTEND_URL is set correctly in backend environment variables
2. **MongoDB Connection**: Verify your MongoDB connection string and password
3. **Stripe Issues**: Check that Stripe keys are correctly set
4. **Build Errors**: Check Vercel build logs for any missing dependencies

### Environment Variables Checklist:
- [ ] MongoDB password (`pass`)
- [ ] Frontend URL (`FRONTEND_URL`)
- [ ] Stripe Secret Key (`STRIPE_SECRET_KEY`)
- [ ] Stripe Publishable Key (`REACT_APP_STRIPE_PUBLISHABLE_KEY`)
- [ ] JWT Secret (if used)
- [ ] API URL (`REACT_APP_API_URL`)

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify all environment variables are set
3. Test API endpoints individually
4. Check browser console for frontend errors

## 🔄 Continuous Deployment

Once set up, Vercel will automatically deploy when you push changes to your GitHub repository! 