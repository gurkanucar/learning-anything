const express = require('express');
const { auth } = require('express-oauth2-jwt-bearer');
const cors = require('cors');

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());

// CORS middleware - allow all origins
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// OAuth2 configuration
const jwtCheck = auth({
  audience: 'account',
  issuerBaseURL: 'http://localhost:8080/realms/general_project',
  tokenSigningAlg: 'RS256'
});

// Middleware to parse JSON bodies
app.use(express.json());

// Public endpoint - no authentication required
app.get('/api/public', (req, res) => {
  res.json({
    message: 'This is a public endpoint - no authentication required'
  });
});

// Protected endpoint - requires authentication
app.get('/api/protected', jwtCheck, (req, res) => {
  res.json({
    message: 'This is a protected endpoint - authentication required',
    user: req.auth
  });
});

// Protected endpoint with data
app.get('/api/protected/data', jwtCheck, (req, res) => {
  res.json({
    message: 'Protected data endpoint',
    data: {
      items: [
        { id: 1, name: 'Protected Item 1' },
        { id: 2, name: 'Protected Item 2' }
      ]
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: err.error || {}
  });
});

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
