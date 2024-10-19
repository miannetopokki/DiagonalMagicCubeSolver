import { Router } from 'express';
import { solveCube } from '../controllers/solverController.js';

const router = Router();

router.post('/solve', solveCube);

export default router;
