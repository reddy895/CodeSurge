import express from 'express';
import { getAllTeams, exportTeamsCSV } from '../controllers/adminController.js';

const router = express.Router();

router.get('/teams', getAllTeams);
router.get('/export/csv', exportTeamsCSV);

export default router;
