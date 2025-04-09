module.exports = {
  apps: [
    {
      name: 'canivotejc-backend',
      script: './server.js', // or index.js or app.js
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 5000 // Or whatever your backend listens on
      }
    }
  ]
};

