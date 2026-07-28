import express from 'express';
import { registerLeader, registerMember, loginLeader } from '../controllers/authController.js';

const router = express.Router();

router.post('/register/leader', registerLeader);
router.post('/register/member', registerMember);
router.post('/login/leader', loginLeader);

export default router;
