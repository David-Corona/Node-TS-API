const express = require('express');
const router = express.Router();

// Import user and admin route groups
const userRoutes = require('./user');
const adminRoutes = require('./admin');

// Define prefixes for route groups
const userPrefix = '/api'; // TODO - change to /api/user ?
const adminPrefix = '/api/admin';

// Mount user and admin route groups with their respective prefixes
router.use(userPrefix, userRoutes);
router.use(adminPrefix, adminRoutes);

module.exports = router;