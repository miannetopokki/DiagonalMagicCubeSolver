import { Router } from 'express';
import { solveSimulatedAnnealing, solveSteepHC, solveRandomRestartHC, solveSidewaysHC } from '../controllers/solverController.js';

const router = Router();

router.post('/steephc', solveSteepHC);
router.post('/simulatedAnnealing', solveSimulatedAnnealing);
router.post('/randomrestartHC', solveRandomRestartHC);
router.post('/sidewaysmove', solveSidewaysHC);

export default router;
