# 🚀 Ticketly Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. **Code Issues Fixed**
- [x] ESLint errors resolved (unused Link import)
- [x] Hardcoded localhost URLs removed
- [x] All changes committed and pushed to GitHub

### 2. **Environment Variables Setup**

#### **Backend Environment Variables** (Set in Vercel)
```env
MONGODB_URI=mongodb+srv://Dhwip:your_actual_password@cluster0.qrxo2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DB_PASSWORD=your_actual_password
JWT_SECRET=your_super_secure_jwt_secret_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

#### **Frontend Environment Variables** (Set in Vercel)
```env
REACT_APP_API_URL=https://your-backend-domain.vercel.app
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
NODE_ENV=production
```

## 🌐 Deployment Steps

### **Step 1: Deploy Backend**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository: `Dhwip/Ticketly`
4. Configure:
   - **Framework Preset**: Node.js
   - **Root Directory**: `backend`
   - **Build Command**: Leave empty (uses vercel.json)
   - **Output Directory**: Leave empty
5. **Add Environment Variables** (click "Environment Variables"):
   - Add all backend variables listed above
6. Click "Deploy"
7. **Note your backend URL** (e.g., `https://ticketly-backend.vercel.app`)

### **Step 2: Deploy Frontend**
1. Go back to Vercel dashboard
2. Click "New Project"
3. Import the same repository: `Dhwip/Ticketly`
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. **Add Environment Variables**:
   - `REACT_APP_API_URL`: Your backend URL from Step 1
   - `REACT_APP_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
   - `NODE_ENV`: `production`
6. Click "Deploy"
7. **Note your frontend URL** (e.g., `https://ticketly-frontend.vercel.app`)

### **Step 3: Update Backend CORS**
1. Go back to your backend project in Vercel
2. Add environment variable:
   - `FRONTEND_URL`: Your frontend URL from Step 2
3. Redeploy the backend

## 🧪 Testing Checklist

### **Backend Testing**
- [ ] Visit `https://your-backend-url.vercel.app/health`
- [ ] Should return: `{"status":"OK","timestamp":"...","environment":"production"}`

### **Frontend Testing**
- [ ] Visit your frontend URL
- [ ] Check if the page loads without errors
- [ ] Test user registration/login
- [ ] Test admin login
- [ ] Test movie browsing
- [ ] Test booking functionality (if Stripe is configured)

### **API Testing**
- [ ] User registration works
- [ ] User login works
- [ ] Admin login works
- [ ] Movie listing works
- [ ] Booking creation works

## 🔧 Troubleshooting

### **Common Issues**
1. **CORS Errors**: Make sure `FRONTEND_URL` is set correctly in backend
2. **Database Connection**: Verify MongoDB URI and network access
3. **Build Failures**: Check environment variables are set correctly
4. **API 404 Errors**: Ensure backend routes are working

### **Debug Commands**
```bash
# Test backend locally
cd backend
npm install
npm start

# Test frontend locally
cd frontend
npm install
npm start

# Test frontend build
cd frontend
npm run build
```

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify all environment variables are set
3. Test locally first
4. Check browser console for errors

## 🎉 Success Indicators

Your deployment is successful when:
- ✅ Backend health check returns OK
- ✅ Frontend loads without console errors
- ✅ User registration/login works
- ✅ Admin login works
- ✅ Movie browsing works
- ✅ Booking system works (if configured)

---

**Remember**: Keep your environment variables secure and never commit them to Git! 