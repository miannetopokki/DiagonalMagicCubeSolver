// hillclimb.js
import { MagicCube } from './magicCube.js';

class SimulatedAnnealing extends MagicCube {
    constructor() {
        super();
    }
    showLoading() {
        document.getElementById('loading').style.display = 'block';
    }
    
    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }
    

    async solveSA(cubeState) { 
        this.showLoading();
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
            const { solvedCube, seq_elemen, h_before, h_after, algoritma, n_iter, h_values, e_values, stuck_freq,execution_time} = result;
            this.solvedCubeState = solvedCube; 
            this.animationProgress = 0;
            this.sequensElement = seq_elemen;
            this.hValues = h_values;

            // this.animateCamera(this.solvedControls, this.solvedCamera, this.solvedRenderer, this.solvedScene);
            this.visualizeCube(this.solvedCubeState, this.solvedScene,this.solvedControls);
            


            document.getElementById('hBeforeValue').innerText = h_before;
            document.getElementById('hAfterValue').innerText = h_after;
            document.getElementById('algoritma').innerText = algoritma;
            document.getElementById('waktuEksekusiSpan').innerText = execution_time;
            document.getElementById('iterasiSpan').innerText = n_iter;
            document.getElementById('stuck_freqSpan').innerText = stuck_freq;
            const annealingctx = document.getElementById('annealingChart').getContext('2d');
            const ObjectiveChart = document.getElementById('objectiveFunctionChart').getContext('2d');
            const annealingChart = new Chart(annealingctx, {
                type: 'line',
                data: {
                    labels:  Array.from({ length: e_values.length }, (_, i) => i + 1),
                    datasets: [{
                        label: 'e^(ΔH / T) over Iterations',
                        data: e_values,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 1,
                        fill: true,
                    }]
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Iteration'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'e^(ΔH / T)'
                            },
                            min: 0,
                            max: 1,
                        }
                    }
                }
            });
            const ctx = document.getElementById('objectiveFunctionChart').getContext('2d');
    
            new Chart(ObjectiveChart, {
                type: 'line',
                data: {
                    labels: Array.from({ length: h_values.length }, (_, i) => i + 1),
                    datasets: [{
                        label: 'Objective Function (h) per 25 Iteration',
                        data: h_values,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: { title: { display: true, text: 'Iteration' } },
                        y: { title: { display: true, text: 'Objective Function (h)' } }
                    }
                }
            });

        } catch (error) {
            console.error('Error:', error);
        }finally {
            this.hideLoading(); 
        }
        
    }

    solveCube() {
        this.solveSA(this.cubeState); 
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

const simulatedAnnealingInstance = new SimulatedAnnealing(); 

const replayButton = document.getElementById("replay");
replayButton.addEventListener("click", onReplayButtonClick.bind(this));
function onReplayButtonClick() {
    console.log(simulatedAnnealingInstance.getSeqElementLength());
    if (simulatedAnnealingInstance.getSeqElementLength() === 0) {
        alert("Tidak ada replay yang dapat dilakukan, silahkan solve dulu.");
        return; 
    }

    toggleButtons(true);
    simulatedAnnealingInstance.animateCubeMovement().then(() => {
        toggleButtons(false);
    });
}
function toggleButtons(disabled) {
    const buttons = document.querySelectorAll('button:not(#generateCubeButton):not(#plot)');
    buttons.forEach(button => {
        button.disabled = disabled;
    });
    
    // document.getElementById('iterationSlider').disabled = disabled;
    document.getElementById('speedSlider').disabled = disabled;
}
const speedSlider = document.getElementById("speedSlider");
const currentSpeedLabel = document.getElementById("currentSpeed");
speedSlider.addEventListener("input", (event) => {
    const speedValue = event.target.value;
    simulatedAnnealingInstance.setSpeedDurasi(speedValue);
    currentSpeedLabel.textContent = speedValue; // Perbarui label tampilan
});

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

// Event listener untuk slider
// const slider = document.getElementById('iterationSlider');
// const currentIterationLabel = document.getElementById('currentIteration');
// slider.addEventListener('input', (event) => {
//     const iteration = parseInt(event.target.value);
//     currentIterationLabel.textContent = iteration; // Update label iterasi
//     updateAnimation(iteration); // Panggil fungsi untuk memperbarui animasi
// });

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
