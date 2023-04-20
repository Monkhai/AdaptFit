const express = require('express');
const userRoutes = require('../routes/userRoutes');
const exercisesRoutes = require('../routes/exercisesRoutes');

const error = require('../middleware/error');

module.exports = function (app) {
  app.use(express.json());
  app.use('/api/users', userRoutes);
  app.use('/api/exercises', exercisesRoutes);
  app.use(error);
};
