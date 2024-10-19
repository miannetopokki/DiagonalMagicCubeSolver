import MagicCube from '../models/MagicCube.js';

export const solveCube = (req, res) => {
    const { cubeState } = req.body; 

    if (!cubeState) {
        return res.status(400).json({ error: 'Cube state is required' });
    }

    const magicCube = new MagicCube(cubeState); 
    const solvedCube = magicCube.solve();

    res.json({ solvedCube }); 
};
