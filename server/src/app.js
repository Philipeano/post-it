// const express = require('express');
// const logger = require('morgan');
// const bodyParser = require('body-parser');
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import models from './models';
// TODO: import all routes

// Configure environment settings
dotenv.config();

// Set up server express
const app = express();

// Log requests to the console
app.use(logger('dev'));

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// TODO: Set up middleware
// TODO: Set up authentication routes
// TODO: Set up all other routes

// Default/random route
app.use('/api', (req, res) => {
  res.status(200).send({ message: 'Welcome! PostIT API is running...' });
});

app.use('*', (req, res) => {
  res.status(200).sendFile('../../template/index.html');
});

// Retrieve port for this app environment
const port = process.env.PORT || 8000;

// TODO: Run Sequelize sync on models

// Create server and initialize it with the express app
const server = app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});

// Export server
export default server;
// module.exports = server;
