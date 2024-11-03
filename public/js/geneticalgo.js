// hillclimb.js
import { MagicCube } from "./magicCube.js";

class GeneticAlgorithm extends MagicCube {
  constructor() {
    super();
  }

  async solveGA(cubeState) {
    try {
      const iterationInput = document.getElementById("iterationInput").value;
      const populationInput = document.getElementById("populationInput").value;
      const response = await fetch("/api/geneticalgorithm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cubeState,
          jumlahIterasi: parseInt(iterationInput, 10),
          banyakPopulasi: parseInt(populationInput, 10),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Hasil solusi dari server:", result);
      const {
        solvedCube,
        seq_elemen,
        h_before,
        h_after,
        algoritma,
        n_iter,
        h_values,
        execution_time,
      } = result;
      this.solvedCubeState = solvedCube;
      this.animationProgress = 0;
      this.sequensElement = seq_elemen;

      this.animateCamera(
        this.solvedControls,
        this.solvedCamera,
        this.solvedRenderer,
        this.solvedScene
      );
      this.visualizeCube(
        this.solvedCubeState,
        this.solvedScene,
        this.solvedControls
      );

      this.plotObjectiveFunction(h_values);

      document.getElementById("hBeforeValue").innerText = h_before;
      document.getElementById("hAfterValue").innerText = h_after;
      document.getElementById("algoritmaSpan").innerText = algoritma;
      document.getElementById("iterasiSpan").innerText = n_iter;
      document.getElementById("waktuEksekusiSpan").innerText = execution_time;
      document.getElementById("iterationSlider").max = n_iter; // Set max value for the slider
    } catch (error) {
      console.error("Error:", error);
    }
  }

  solveCube() {
    this.solveGA(this.cubeState);
    this.isSolved = true;
  }
  getSeqElementLength() {
    return this.sequensElement.length;
  }
  setSpeedDurasi(speed) {
    console.log("Speed = ", speed, "x");
    this.speedUpDurasi = this.replayDurasi / speed;
  }
}

const GAInstance = new GeneticAlgorithm();

const replayButton = document.getElementById("replay");
replayButton.addEventListener("click", onReplayButtonClick.bind(this));
function onReplayButtonClick() {
  console.log(GAInstance.getSeqElementLength());
  if (GAInstance.getSeqElementLength() === 0) {
    alert(" Tidak ada replay yang dapat dilakukan,Silahkan solve dulu.");
    return;
  }

  GAInstance.animateCubeMovement();
}
const speedSlider = document.getElementById("speedSlider");
const currentSpeedLabel = document.getElementById("currentSpeed");
speedSlider.addEventListener("input", (event) => {
  const speedValue = event.target.value;
  GAInstance.setSpeedDurasi(speedValue);
  currentSpeedLabel.textContent = speedValue; // Perbarui label tampilan
});
document.getElementById("addX").addEventListener("click", () => {
  GAInstance.changeXSpace(true);
});

document.getElementById("minusX").addEventListener("click", () => {
  GAInstance.changeXSpace(false);
});

document.getElementById("addY").addEventListener("click", () => {
  GAInstance.changeYSpace(true);
});

document.getElementById("minusY").addEventListener("click", () => {
  GAInstance.changeYSpace(false);
});

// Event listener untuk slider
const slider = document.getElementById("iterationSlider");
const currentIterationLabel = document.getElementById("currentIteration");
slider.addEventListener("input", (event) => {
  const iteration = parseInt(event.target.value);
  currentIterationLabel.textContent = iteration; // Update label iterasi
  updateAnimation(iteration); // Panggil fungsi untuk memperbarui animasi
});

document.getElementById("addZ").addEventListener("click", () => {
  GAInstance.changeZSpace(true);
});

document.getElementById("minusZ").addEventListener("click", () => {
  GAInstance.changeZSpace(false);
});

document.getElementById("solveCubeButton").addEventListener("click", () => {
  GAInstance.solveCube();
});
document.getElementById("gridButton").addEventListener("click", () => {
  GAInstance.addGrid();
});
document.getElementById("axisButton").addEventListener("click", () => {
  GAInstance.addAxis();
});
export { GeneticAlgorithm };
