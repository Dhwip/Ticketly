// Configuration for different environments
const config = {
  development: {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:9000',
    stripePublishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_publishable_key'
  },
  production: {
    apiUrl: process.env.REACT_APP_API_URL || 'https://ticketly-backend.vercel.app',
    stripePublishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_publishable_key'
  },
  test: {
    apiUrl: 'http://localhost:9000',
    stripePublishableKey: 'pk_test_your_stripe_publishable_key'
  }
};

const environment = process.env.NODE_ENV || 'development';
export const API_BASE_URL = config[environment].apiUrl;
export const STRIPE_PUBLISHABLE_KEY = config[environment].stripePublishableKey;

// Log configuration in development
if (environment === 'development') {
  console.log('🔧 Frontend Configuration:', {
    environment,
    apiUrl: API_BASE_URL,
    hasStripeKey: !!STRIPE_PUBLISHABLE_KEY
  });
}

// Log configuration in production too for debugging
if (environment === 'production') {
  console.log('🔧 Frontend Configuration (Production):', {
    environment,
    apiUrl: API_BASE_URL,
    hasStripeKey: !!STRIPE_PUBLISHABLE_KEY
  });
}

export default config[environment]; 