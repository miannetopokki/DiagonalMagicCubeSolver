// hillclimb.js
import { MagicCube } from './magicCube.js';

let index = 1;
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

            // this.animateCamera(this.solvedControls, this.solvedCamera, this.solvedRenderer, this.solvedScene);
            this.visualizeCube(this.solvedCubeState, this.solvedScene,this.solvedControls);

            this.plotObjectiveFunction(h_values);

            document.getElementById('hBeforeValue').innerText = h_before;
            document.getElementById('hAfterValue').innerText = h_after;
            document.getElementById('algoritmaSpan').innerText = algoritma;
            document.getElementById('iterasiSpan').innerText = n_iter;
            document.getElementById('waktuEksekusiSpan').innerText = execution_time;
            // document.getElementById('iterationSlider').max = n_iter; // Set max value for the slider


        } catch (error) {
            console.error('Error:', error);
        }
    }
    async solveSidewayHC(cubeState){
        try {
            const response = await fetch('/api/sidewaysmove', {
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

            // this.animateCamera(this.solvedControls, this.solvedCamera, this.solvedRenderer, this.solvedScene);
            this.visualizeCube(this.solvedCubeState, this.solvedScene,this.solvedControls);

            this.plotObjectiveFunction(h_values);

            document.getElementById('hBeforeValue').innerText = h_before;
            document.getElementById('hAfterValue').innerText = h_after;
            document.getElementById('algoritmaSpan').innerText = algoritma;
            document.getElementById('iterasiSpan').innerText = n_iter;
            document.getElementById('waktuEksekusiSpan').innerText = execution_time;
            // document.getElementById('iterationSlider').max = n_iter; // Set max value for the slider


        } catch (error) {
            console.error('Error:', error);
        }

    }
    async solveRandomRestartHC(cubeState){
      
        try {
            const response = await fetch('/api/randomrestartHC', {
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

            // this.animateCamera(this.solvedControls, this.solvedCamera, this.solvedRenderer, this.solvedScene);
            this.visualizeCube(this.solvedCubeState, this.solvedScene,this.solvedControls);

            this.plotObjectiveFunction(h_values);

            document.getElementById('hBeforeValue').innerText = h_before;
            document.getElementById('hAfterValue').innerText = h_after;
            document.getElementById('algoritmaSpan').innerText = algoritma;
            document.getElementById('iterasiSpan').innerText = n_iter;
            document.getElementById('waktuEksekusiSpan').innerText = execution_time;
            // document.getElementById('iterationSlider').max = n_iter; // Set max value for the slider


        } catch (error) {
            console.error('Error:', error);
        }
    }
    async solveStochasticHC(cubeState){
        try {
            const response = await fetch('/api/stochastichc', {
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

            // this.animateCamera(this.solvedControls, this.solvedCamera, this.solvedRenderer, this.solvedScene);
            this.visualizeCube(this.solvedCubeState, this.solvedScene,this.solvedControls);
            this.plotObjectiveFunction(h_values);

            document.getElementById('hBeforeValue').innerText = h_before;
            document.getElementById('hAfterValue').innerText = h_after;
            document.getElementById('algoritmaSpan').innerText = algoritma;
            document.getElementById('iterasiSpan').innerText = n_iter;
            document.getElementById('waktuEksekusiSpan').innerText = execution_time;
            // document.getElementById('iterationSlider').max = n_iter; // Set max value for the slider


        } catch (error) {
            console.error('Error:', error);
        }
        

    }

    solveCube(index) {
        if (index != 0){
            console.log("udah ada solved, clear ulang");
            this.clearScene(this.solvedScene)
        }
        if (index == 1){
            console.log("Steep hc");

            this.solveSteepHC(this.cubeState);
        }
        else if(index == 2){
            console.log("RR hc");

            this.solveRandomRestartHC(this.cubeState);
        }
        else if(index == 3){
            console.log("sideway hc");

            this.solveSidewayHC(this.cubeState);
        }else if(index ==4){
            console.log("stochastic hc");
            this.solveStochasticHC(this.cubeState);
        }
        this.isSolved = true; 
    }
    getSeqElementLength(){
        return this.sequensElement.length;
    }
    setSpeedDurasi(speed){
        console.log("Speed = ", speed ,"x");
        this.speedUpDurasi = this.replayDurasi / speed;
    }
}

const hillClimbInstance = new HillClimb(); 


const replayButton = document.getElementById("replay");
replayButton.addEventListener("click", onReplayButtonClick.bind(this));
function onReplayButtonClick() {
    console.log(hillClimbInstance.getSeqElementLength());
    if (hillClimbInstance.getSeqElementLength() === 0) {
        alert("Tidak ada replay yang dapat dilakukan, silahkan solve dulu.");
        return; 
    }

    toggleButtons(true);

    hillClimbInstance.animateCubeMovement().then(() => {
        toggleButtons(false);
    });
}
function toggleButtons(disabled) {
    const buttons = document.querySelectorAll('button:not(#generateCubeButton)');
    buttons.forEach(button => {
        button.disabled = disabled;
    });
    
    document.getElementById('hc-list').disabled = disabled;
    // document.getElementById('iterationSlider').disabled = disabled;
    document.getElementById('speedSlider').disabled = disabled;
}

const speedSlider = document.getElementById("speedSlider");
const currentSpeedLabel = document.getElementById("currentSpeed");
speedSlider.addEventListener("input", (event) => {
    const speedValue = event.target.value;
    hillClimbInstance.setSpeedDurasi(speedValue);
    currentSpeedLabel.textContent = speedValue;
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
// const slider = document.getElementById('iterationSlider');
// const currentIterationLabel = document.getElementById('currentIteration');
// slider.addEventListener('input', (event) => {
//     const iteration = parseInt(event.target.value);
//     currentIterationLabel.textContent = iteration; // Update label iterasi
//     updateAnimation(iteration); // Panggil fungsi untuk memperbarui animasi
// });


document.getElementById('addZ').addEventListener('click', () => {
    hillClimbInstance.changeZSpace(true);

});

document.getElementById('minusZ').addEventListener('click', () => {
    hillClimbInstance.changeZSpace(false);

});

function handleSelection(value) {
    if (value === "1") {
        index = 1;
    } else if (value === "2") {
        index = 2;
    }
    else if (value === "3") {
        index = 3;
    }else if (value === "4"){
        index = 4;
    }
    
}

window.handleSelection = handleSelection;


document.getElementById('solveCubeButton').addEventListener('click', () => {
    hillClimbInstance.solveCube(index);
});
document.getElementById('gridButton').addEventListener('click', () => {
    hillClimbInstance.addGrid();
});
document.getElementById('axisButton').addEventListener('click', () => {
    hillClimbInstance.addAxis();
});
export { HillClimb };
