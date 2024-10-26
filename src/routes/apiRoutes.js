import { Router } from 'express';
import { solveSimulatedAnnealing, solveSteepHC } from '../controllers/solverController.js';

const router = Router();

router.post('/steephc', solveSteepHC);
router.post('/simulatedAnnealing', solveSimulatedAnnealing);

export default router;
