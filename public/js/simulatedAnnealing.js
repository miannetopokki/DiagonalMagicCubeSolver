// hillclimb.js
import { MagicCube } from './magicCube.js';

class SimulatedAnnealing extends MagicCube {
    constructor() {
        super();
    }

    async solveSA(cubeState) { 
        try {
            const response = await fetch('/api/simulatedAnnealing', {
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
            const { solvedCube, h_before, h_after, algoritma, n_iter ,h_values,execution_time} = result;
            this.solvedCubeState = solvedCube; 
            this.animationProgress = 0;

            this.animateCamera(this.solvedControls, this.solvedCamera, this.solvedRenderer, this.solvedScene);
            this.visualizeCube(this.solvedCubeState, true);
            this.plotObjectiveFunction(h_values);


            document.getElementById('hBeforeValue').innerText = h_before;
            document.getElementById('hAfterValue').innerText = h_after;
            document.getElementById('algoritmaSpan').innerText = algoritma;
            document.getElementById('iterasiSpan').innerText = n_iter;
            document.getElementById('waktuEksekusiSpan').innerText = execution_time;


        } catch (error) {
            console.error('Error:', error);
        }
    }

    solveCube() {
        this.solveSA(this.cubeState); 
        this.isSolved = true; 
    }
}

const simulatedAnnealingInstance = new SimulatedAnnealing(); 

document.getElementById('addX').addEventListener('click', () => {
    simulatedAnnealingInstance.changeXSpace(true);
});

document.getElementById('minusX').addEventListener('click', () => {
    simulatedAnnealingInstance.changeXSpace(false);

});



document.getElementById('addY').addEventListener('click', () => {
    simulatedAnnealingInstance.changeYSpace(true);

});

document.getElementById('minusY').addEventListener('click', () => {
    simulatedAnnealingInstance.changeYSpace(false);

});





document.getElementById('addZ').addEventListener('click', () => {
    simulatedAnnealingInstance.changeZSpace(true);

});

document.getElementById('minusZ').addEventListener('click', () => {
    simulatedAnnealingInstance.changeZSpace(false);

});


document.getElementById('solveCubeButton').addEventListener('click', () => {
    simulatedAnnealingInstance.solveCube();
});
document.getElementById('gridButton').addEventListener('click', () => {
    simulatedAnnealingInstance.addGrid();
});
document.getElementById('axisButton').addEventListener('click', () => {
    simulatedAnnealingInstance.addAxis();
});
export { SimulatedAnnealing };
