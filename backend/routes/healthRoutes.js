/**
 * Health Routes
 * 
 * This file defines routes related to server health checks.
 * These routes are used to monitor server status and availability.
 */

import express from "express";
import { getHealth } from "../controllers/healthController.js";

// Create a new router instance
const router = express.Router();

// GET /api/health - Check server health status
router.get("/", getHealth);

export default router;
