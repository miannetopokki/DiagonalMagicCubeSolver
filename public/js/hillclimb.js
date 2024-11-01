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
            const { solvedCube,seq_elemen, h_before, h_after, algoritma, n_iter,h_values,execution_time } = result;
            this.solvedCubeState = solvedCube; 
            this.animationProgress = 0;
            this.sequensElement = seq_elemen;

            this.animateCamera(this.solvedControls, this.solvedCamera, this.solvedRenderer, this.solvedScene);
            this.visualizeCube(this.solvedCubeState, this.solvedScene,this.solvedControls);

            this.plotObjectiveFunction(h_values);

            document.getElementById('hBeforeValue').innerText = h_before;
            document.getElementById('hAfterValue').innerText = h_after;
            document.getElementById('algoritmaSpan').innerText = algoritma;
            document.getElementById('iterasiSpan').innerText = n_iter;
            document.getElementById('waktuEksekusiSpan').innerText = execution_time;
            document.getElementById('iterationSlider').max = n_iter; // Set max value for the slider


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

document.getElementById('replay').addEventListener('click', () => {
    console.log("replay");
   hillClimbInstance.animateCubeMovement();
});


document.getElementById('addX').addEventListener('click', () => {
    hillClimbInstance.changeXSpace(true);
});

document.getElementById('minusX').addEventListener('click', () => {
    hillClimbInstance.changeXSpace(false);

});



document.getElementById('addY').addEventListener('click', () => {
    hillClimbInstance.changeYSpace(true);

});

document.getElementById('minusY').addEventListener('click', () => {
    hillClimbInstance.changeYSpace(false);

});


// Event listener untuk slider
const slider = document.getElementById('iterationSlider');
const currentIterationLabel = document.getElementById('currentIteration');
slider.addEventListener('input', (event) => {
    const iteration = parseInt(event.target.value);
    currentIterationLabel.textContent = iteration; // Update label iterasi
    updateAnimation(iteration); // Panggil fungsi untuk memperbarui animasi
});


document.getElementById('addZ').addEventListener('click', () => {
    hillClimbInstance.changeZSpace(true);

});

document.getElementById('minusZ').addEventListener('click', () => {
    hillClimbInstance.changeZSpace(false);

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
