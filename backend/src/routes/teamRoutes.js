import express from 'express';
import { getMyTeam, verifyTeam } from '../controllers/teamController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/my-team', protect, getMyTeam);
router.get('/verify/:team_code', verifyTeam);

export default router;
