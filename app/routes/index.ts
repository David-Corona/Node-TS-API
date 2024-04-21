// const express = require('express');
// const router = express.Router();

import express from 'express';

// Import user and admin route groups
import userRoutes from './user'; // Assuming you have a 'user.ts' file
import adminRoutes from './admin'; // Assuming you have an 'admin.ts' file


// Import user and admin route groups
// const userRoutes = require('./user');
// const adminRoutes = require('./admin');

const router = express.Router();

// Define prefixes for route groups
const userPrefix = '/api'; // TODO - change to /api/user ?
const adminPrefix = '/api/admin';

// Mount user and admin route groups with their respective prefixes
router.use(userPrefix, userRoutes);
router.use(adminPrefix, adminRoutes);

// module.exports = router;
export default router;