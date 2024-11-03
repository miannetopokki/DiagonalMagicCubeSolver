import { Router } from 'express';
import { solveSimulatedAnnealing, solveSteepHC, solveRandomRestartHC, solveSidewaysHC,solveStochasticHC,solveGeneticAlgorithm } from '../controllers/solverController.js';

const router = Router();

router.post('/steephc', solveSteepHC);
router.post('/simulatedAnnealing', solveSimulatedAnnealing);
router.post('/randomrestartHC', solveRandomRestartHC);
router.post('/sidewaysmove', solveSidewaysHC);
router.post('/stochastichc', solveStochasticHC);
router.post('/geneticalgorithm', solveGeneticAlgorithm);

export default router;
