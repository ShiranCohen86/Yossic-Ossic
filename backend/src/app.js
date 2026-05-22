const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const env = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./middleware/error');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: env.NODE_ENV === 'production' ? env.FRONTEND_URL : true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
}));

app.use('/api', routes);

if (env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../public')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });
}

app.use(errorHandler);

module.exports = app;
