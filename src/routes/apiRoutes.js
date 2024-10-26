import { Router } from 'express';
import { solveSteepHC } from '../controllers/solverController.js';

const router = Router();

router.post('/steephc', solveSteepHC);

export default router;
