// hillclimb.js
import { MagicCube } from './magicCube.js';

let index = 0;
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
    async solveSidewayHC(cubeState,maxsidewaysMove) {
        try {
            const response = await fetch('/api/sidewaysmove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cubeState,maxsidewaysMove })
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
            document.getElementById('iterationSlider').max = n_iter; 


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

    solveCube(index) {
        const maxSidewaysMoves = index === 3 ? parseInt(document.getElementById('maxSidewaysMoves').value) : null;
        console.log("maxSidewaysMoves = ", maxSidewaysMoves);   
        if (index == 1){
            this.solveSteepHC(this.cubeState);
        }
        else if(index == 2){
            this.solveRandomRestartHC(this.cubeState);
        }
        else if(index == 3){
            this.solveSidewayHC(this.cubeState,maxSidewaysMoves);
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
        alert(" Tidak ada replay yang dapat dilakukan,Silahkan solve dulu.");
        return; 
    }

    hillClimbInstance.animateCubeMovement();
}
const speedSlider = document.getElementById("speedSlider");
const currentSpeedLabel = document.getElementById("currentSpeed");
speedSlider.addEventListener("input", (event) => {
    const speedValue = event.target.value;
    hillClimbInstance.setSpeedDurasi(speedValue);
    currentSpeedLabel.textContent = speedValue; // Perbarui label tampilan
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

function handleSelection(value) {
    const sliderSection = document.getElementById('sideways-slider');

    if (value === "1") {
        index = 1;
        sliderSection.style.display = 'none';
    } else if (value === "2") {
        index = 2;
        sliderSection.style.display = 'none';
    }
    else if (value === "3") {
        index = 3;
        sliderSection.style.display = 'block';
    }
}
function updateSliderValue(value) {
    document.getElementById('sliderValue').innerText = value;
}


window.updateSliderValue = updateSliderValue;


window.handleSelection = handleSelection;


document.getElementById('solveCubeButton').addEventListener('click', () => {
    const maxSidewaysMoves = parseInt(document.getElementById('maxSidewaysMoves').value);
    hillClimbInstance.solveCube(index, maxSidewaysMoves);
});
document.getElementById('gridButton').addEventListener('click', () => {
    hillClimbInstance.addGrid();
});
document.getElementById('axisButton').addEventListener('click', () => {
    hillClimbInstance.addAxis();
});
export { HillClimb };
