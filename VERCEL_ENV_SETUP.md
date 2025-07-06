# Vercel Environment Variables Setup

## Backend Environment Variables

Set these in your Vercel backend project settings:

### Required Variables:
- `NODE_ENV`: `production`
- `MONGODB_URI`: Your MongoDB connection string
- `DB_PASSWORD`: Your database password (if not in MONGODB_URI)

### Optional Variables:
- `FRONTEND_URL`: `https://ticketly-frontend-phi.vercel.app`
- `VERCEL_URL`: Automatically set by Vercel

## Frontend Environment Variables

Set these in your Vercel frontend project settings:

### Required Variables:
- `REACT_APP_API_URL`: `https://ticketly-backend.vercel.app`
- `REACT_APP_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key

## How to Set Environment Variables in Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add each variable with the appropriate value
5. Redeploy your application

## Testing the Setup:

1. Deploy both frontend and backend with the updated environment variables
2. Use the ApiTest component to verify the connection
3. Check the browser console for any CORS errors
4. Test the login functionality

## Troubleshooting:

If you still get CORS errors:
1. Check that the frontend URL is correctly added to the backend CORS configuration
2. Verify that both applications are deployed and running
3. Check the Vercel function logs for any errors
4. Ensure environment variables are properly set 