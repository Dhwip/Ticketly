// Configuration for different environments
const config = {
  development: {
    apiUrl: 'http://localhost:9000',
    stripePublishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
  },
  production: {
    apiUrl: process.env.REACT_APP_API_URL || 'https://your-backend-url.vercel.app',
    stripePublishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
  }
};

const environment = process.env.NODE_ENV || 'development';
export const API_BASE_URL = config[environment].apiUrl;
export const STRIPE_PUBLISHABLE_KEY = config[environment].stripePublishableKey;

export default config[environment]; 