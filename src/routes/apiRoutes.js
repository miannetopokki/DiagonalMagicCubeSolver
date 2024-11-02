import { Router } from 'express';
import { solveSimulatedAnnealing, solveSteepHC, solveRandomRestartHC } from '../controllers/solverController.js';

const router = Router();

router.post('/steephc', solveSteepHC);
router.post('/simulatedAnnealing', solveSimulatedAnnealing);
router.post('/randomrestartHC', solveRandomRestartHC);

export default router;
