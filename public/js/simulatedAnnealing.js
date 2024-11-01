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
            const { solvedCube, h_before, h_after, algoritma, n_iter, h_values, e_values, stuck_freq } = result;
            this.solvedCubeState = solvedCube; 
            this.animationProgress = 0;

            this.animateCamera(this.solvedControls, this.solvedCamera, this.solvedRenderer, this.solvedScene);
            this.visualizeCube(this.solvedCubeState, true);

            document.getElementById('hBeforeValue').innerText = h_before;
            document.getElementById('hAfterValue').innerText = h_after;
            document.getElementById('algoritma').innerText = algoritma;
            document.getElementById('iterasi').innerText = `Iterasi : ${n_iter}`;
            document.getElementById('stuck_freq').innerText = `stuck_freq : ${stuck_freq}`;
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
                        label: 'Objective Function (h) per 100 Iteration',
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
