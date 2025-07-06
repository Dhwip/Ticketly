import React, { useState } from 'react';
import { testApiConnection } from '../api-helpers/api-helpers.js';
import { API_BASE_URL } from '../config/config.js';

const ApiTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setTestResult(null);

    try {
      const result = await testApiConnection();
      setTestResult(result);
    } catch (err) {
      setError(err.message || 'Test failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>API Connection Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>Current API URL:</strong> {API_BASE_URL}
      </div>

      <button 
        onClick={handleTest}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test API Connection'}
      </button>

      {testResult && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#d4edda', 
          border: '1px solid #c3e6cb',
          borderRadius: '5px'
        }}>
          <h3>✅ Test Successful</h3>
          <pre>{JSON.stringify(testResult, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#f8d7da', 
          border: '1px solid #f5c6cb',
          borderRadius: '5px'
        }}>
          <h3>❌ Test Failed</h3>
          <p><strong>Error:</strong> {error}</p>
          <p>This could be due to:</p>
          <ul>
            <li>CORS configuration issues</li>
            <li>Backend server not running</li>
            <li>Incorrect API URL</li>
            <li>Network connectivity issues</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ApiTest; 