import express from 'express';

// Import route groups
import userRoutes from './user';
import adminRoutes from './admin';

const router = express.Router();

// Define prefixes for route groups
const userPrefix = '/api'; // TODO - change to /api/user?
const adminPrefix = '/api/admin';

// Mount route groups with their respective prefixes
router.use(userPrefix, userRoutes);
router.use(adminPrefix, adminRoutes);


export default router;