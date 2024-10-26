// hillclimb.js
import { MagicCube } from './magicCube.js';

class HillClimb extends MagicCube {
    constructor() {
        super();
    }

    async solveSteepHC(cubeState) { 
        try {
            const response = await fetch('/api/steephc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cubeState })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Hasil solusi dari server:', result);
            const { solvedCube, h_before, h_after, algoritma, n_iter } = result;
            this.solvedCubeState = solvedCube; 
            this.animationProgress = 0;

            this.animateCamera(this.solvedControls, this.solvedCamera, this.solvedRenderer, this.solvedScene);
            this.visualizeCube(this.solvedCubeState, true);

            document.getElementById('hBeforeValue').innerText = h_before;
            document.getElementById('hAfterValue').innerText = h_after;
            document.getElementById('algoritma').innerText = algoritma;
            document.getElementById('iterasi').innerText = n_iter;

        } catch (error) {
            console.error('Error:', error);
        }
    }
    async solveSidewayHC(cubeState){

    }
    async solveRandomRestartHC(cubeState){

    }

    solveCube() {
        this.solveSteepHC(this.cubeState); 
        this.isSolved = true; 
    }
}

const hillClimbInstance = new HillClimb(); 

document.getElementById('increaseSpacingButton').addEventListener('click', () => {
    hillClimbInstance.setCubeSpacing(hillClimbInstance.space + 0.2); 
});

document.getElementById('decreaseSpacingButton').addEventListener('click', () => {
    hillClimbInstance.setCubeSpacing(hillClimbInstance.space - 0.2); 
});

document.getElementById('solveCubeButton').addEventListener('click', () => {
    hillClimbInstance.solveCube();
});
document.getElementById('gridButton').addEventListener('click', () => {
    hillClimbInstance.addGrid();
});
document.getElementById('axisButton').addEventListener('click', () => {
    hillClimbInstance.addAxis();
});
export { HillClimb };
