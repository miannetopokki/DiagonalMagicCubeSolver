class Cube {
    constructor(size, cubeState) {
        this.n = size;
        this.magicNumber = (this.n * (Math.pow(this.n, 3) + 1)) / 2;
        this.cube = cubeState;
        this.h = 0;
        this.iterasi = 0;
        this.maxIterasi = 12000; //buat stochastic
        this.hValues = [];
        this.sequensElement = [];
        this.hValues = []; 
        this.e_values = [];
        this.stuck_freq = 0;
    }

    objectiveFunction() {
        this.h = 0;
    
        // Cek setiap baris di setiap level
        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j < this.n; j++) {
                let rowSum = 0;
                let colSum = 0;
                for (let k = 0; k < this.n; k++) {
                    rowSum += this.cube[i][j][k];
                    colSum += this.cube[i][k][j];
                }
                this.h += Math.abs(rowSum - this.magicNumber);
                this.h += Math.abs(colSum - this.magicNumber);
            }
        }
    
        // Cek setiap pilar (melalui level)
        for (let j = 0; j < this.n; j++) {
            for (let k = 0; k < this.n; k++) {
                let pillarSum = 0;
                for (let i = 0; i < this.n; i++) {
                    pillarSum += this.cube[i][j][k];
                }
                this.h += Math.abs(pillarSum - this.magicNumber);
            }
        }
    
        // Cek diagonal di setiap level (2 diagonal per level)
        for (let i = 0; i < this.n; i++) {
            let diag1Sum = 0;
            let diag2Sum = 0;
            for (let j = 0; j < this.n; j++) {
                diag1Sum += this.cube[i][j][j];
                diag2Sum += this.cube[i][j][this.n - j - 1];
            }
            this.h += Math.abs(diag1Sum - this.magicNumber);
            this.h += Math.abs(diag2Sum - this.magicNumber);
        }
    
        // Cek diagonal vertikal (melalui level)
        for (let j = 0; j < this.n; j++) {
            let vertDiag1 = 0;
            let vertDiag2 = 0;
            for (let i = 0; i < this.n; i++) {
                vertDiag1 += this.cube[i][i][j];
                vertDiag2 += this.cube[i][this.n - i - 1][j];
            }
            this.h += Math.abs(vertDiag1 - this.magicNumber);
            this.h += Math.abs(vertDiag2 - this.magicNumber);
        }
    
        // Cek big diagonal di seluruh kubus
        let bigDiag1 = 0;
        let bigDiag2 = 0;
        for (let i = 0; i < this.n; i++) {
            bigDiag1 += this.cube[i][i][i];
            bigDiag2 += this.cube[i][i][this.n - i - 1];
        }
        this.h += Math.abs(bigDiag1 - this.magicNumber);
        this.h += Math.abs(bigDiag2 - this.magicNumber);
    
        return this.h;
    }
    


    steepestAscentHillClimbing() {
        let currentH = this.objectiveFunction();
        let improved;

        do {
            improved = false;
            for (let i = 0; i < this.n; i++) {
                for (let j = 0; j < this.n; j++) {
                    for (let k = 0; k < this.n; k++) {
                        for (let x = 0; x < this.n; x++) {
                            for (let y = 0; y < this.n; y++) {
                                for (let z = 0; z < this.n; z++) {
                                    if (i !== x || j !== y || k !== z) {
                                        //tuker
                                        [this.cube[i][j][k], this.cube[x][y][z]] = [this.cube[x][y][z], this.cube[i][j][k]];

                                        let newH = this.objectiveFunction();

                                        if (newH < currentH) {
                                            currentH = newH;
                                            improved = true;
                                            this.sequensElement.push([[i, j, k], [x, y, z], [this.cube[x][y][z], this.cube[i][j][k]],currentH]);
                                            this.hValues.push(currentH * (-1));
                                            this.iterasi++;


                                        } else { // newH >= currentH
                                            //balikin
                                            [this.cube[i][j][k], this.cube[x][y][z]] = [this.cube[x][y][z], this.cube[i][j][k]];
                                            // Selesai 1 iterasi, simpan nilai h
                                        }
                                    }
                                }
                            }
                        }

                    }
                }
            }
        } while (improved);

        return this.cube;
    }
    stochasticHillClimbing() {
        let currentH = this.objectiveFunction();
        for (let i = 0; i < this.maxIterasi; i++) {
            let pos1 = Math.floor(Math.random() * (this.n * this.n * this.n));
            let pos2;
            do {
                pos2 = Math.floor(Math.random() * (this.n * this.n * this.n));
            } while (pos1 === pos2);
    
            const x1 = Math.floor(pos1 / (this.n * this.n));
            const y1 = Math.floor((pos1 % (this.n * this.n)) / this.n);
            const z1 = pos1 % this.n;
    
            const x2 = Math.floor(pos2 / (this.n * this.n));
            const y2 = Math.floor((pos2 % (this.n * this.n)) / this.n);
            const z2 = pos2 % this.n;
    
            [this.cube[x1][y1][z1], this.cube[x2][y2][z2]] = [this.cube[x2][y2][z2], this.cube[x1][y1][z1]];
    
            const newH = this.objectiveFunction();
    
            if (newH < currentH) {
                currentH = newH;
                this.sequensElement.push([[i, j, k], [x, y, z], [this.cube[x][y][z], this.cube[i][j][k]],currentH]);
                this.hValues.push(currentH * (-1));
                this.iterasi++;
            } else {
                [this.cube[x1][y1][z1], this.cube[x2][y2][z2]] = [this.cube[x2][y2][z2], this.cube[x1][y1][z1]];
            }
        }
        return this.cube;
    
    }
    
    simulatedAnnealing() {
        let currentH = this.objectiveFunction();
        let Tvalue = 30000;
        const coolingRate = 0.99;
        const maxIterations = 12000;
        do {
            let i = Math.floor(Math.random() * 5);
            let j = Math.floor(Math.random() * 5);
            let k = Math.floor(Math.random() * 5);

            let x = Math.floor(Math.random() * 5);
            let y = Math.floor(Math.random() * 5);
            let z = Math.floor(Math.random() * 5);

            if (i !== x || j !== y || k !== z) {
                [this.cube[i][j][k], this.cube[x][y][z]] = [this.cube[x][y][z], this.cube[i][j][k]];
                let newH = this.objectiveFunction();
                let diffH = currentH - newH;
                const e_prob = Math.exp(diffH/Tvalue);
                if (newH < currentH) {
                    currentH = newH;
                    this.sequensElement.push([[i, j, k], [x, y, z], [this.cube[x][y][z], this.cube[i][j][k]],currentH]);
                } else if(Math.exp(diffH/Tvalue)>0.5){
                    currentH = newH;
                    this.sequensElement.push([[i, j, k], [x, y, z], [this.cube[x][y][z], this.cube[i][j][k]],currentH]);
                    this.stuck_freq++;
                }else{
                    [this.cube[i][j][k], this.cube[x][y][z]] = [this.cube[x][y][z], this.cube[i][j][k]];
                }
                this.iterasi++;
                this.hValues.push(currentH * (-1));
                if(diffH>0){
                    this.e_values.push(0);
                }else{
                    this.e_values.push(Math.exp((diffH)/Tvalue));
                }
                Tvalue *= coolingRate;
            }
        } while (this.iterasi < maxIterations || Tvalue > 1e-10);
        return this.cube;
    }

    randomRestartHillClimbing(maxRestart) {
        let best_h = this.getObjective(); 
        let best_cube = this.cube; 
        let tempIterasi = 0;
        console.log(maxRestart);
        for (let i = 0; i < maxRestart; i++) {
            const newCube = new Cube(this.n, this.generateMagicCubeState(this.n));
            
           
    
            newCube.steepestAscentHillClimbing();
            tempIterasi += newCube.getIterasi();
            
            let currentH = newCube.getObjective();
            this.hValues.push(currentH);
     
            
            if (currentH < best_h) {
                best_h = currentH;
                best_cube = JSON.parse(JSON.stringify(newCube.cube));
                console.log(`Iteration ${i}: Current H = ${currentH}, Best H = ${best_h}`);
            }
        }
        this.iterasi = tempIterasi;
        this.cube = best_cube; 
        return this.cube;
    }
    
    ///Fungsi untuk membuat magic cube state secara random
    generateMagicCubeState(n) {
        const totalNumbers = n * n * n;
        const numbers = Array.from({ length: totalNumbers }, (_, i) => i + 1);
    
      
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
    
        const cubeState = Array.from({ length: n }, () =>
            Array.from({ length: n }, () => Array(n).fill(0))
        );
    
        let index = 0;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                for (let k = 0; k < n; k++) {
                    cubeState[i][j][k] = numbers[index++];
                }
            }
        } 
        return cubeState;
    }

    sidewaysmoveHillClimbing(maxSidewaysMoves) {
        let currentH = this.objectiveFunction();
        let improved;
        let sidewaysMoves = 0;
        console.log(maxSidewaysMoves);
        
        do {
            improved = false;
    
            for (let i = 0; i < this.n; i++) {
                for (let j = 0; j < this.n; j++) {
                    for (let k = 0; k < this.n; k++) {
                        for (let x = 0; x < this.n; x++) {
                            for (let y = 0; y < this.n; y++) {
                                for (let z = 0; z < this.n; z++) {
                                    if (i !== x || j !== y || k !== z) {
                                        // Swap elements
                                        [this.cube[i][j][k], this.cube[x][y][z]] = [this.cube[x][y][z], this.cube[i][j][k]];
    
                                        let newH = this.objectiveFunction();
    
                                       
                                        if (newH < currentH) {
                                            currentH = newH;
                                            improved = true;
                                            sidewaysMoves = 0; //Reset counter
                                            
                                            this.sequensElement.push([[i, j, k], [x, y, z], [this.cube[x][y][z], this.cube[i][j][k]],currentH]);
                                            this.hValues.push(currentH * (-1));
                                            this.iterasi++;
                                        } else if (newH === currentH && sidewaysMoves < maxSidewaysMoves) { 
                                            currentH = newH;
                                            sidewaysMoves++;
                                            
                                            this.sequensElement.push([[i, j, k], [x, y, z], [this.cube[x][y][z], this.cube[i][j][k]],currentH]);
                                            this.hValues.push(currentH * (-1));
                                            this.iterasi++;
                                        } else { 
                                            [this.cube[i][j][k], this.cube[x][y][z]] = [this.cube[x][y][z], this.cube[i][j][k]];
                                        }
                                        
            
                                        if (sidewaysMoves >= maxSidewaysMoves) return this.cube;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
        } while (improved);
    
        return this.cube;
    }
    geneticAlgorithm(populationSize, iterations) {
        // Initial Population
        let population = this.initializePopulation(populationSize);
        const maxIterations = iterations;
        do {
            // Fitness Function
            let fitnessScores = population.map(cubeState => this.calculateFitness(cubeState));
            
            // Check if we found a solution
            let bestFitness = Math.min(...fitnessScores);
            let bestIndex = fitnessScores.indexOf(bestFitness);
            if (bestFitness === 0) {
                // Solution found
                this.cube = population[bestIndex];
                return this.cube;
            }
            
            // Selection
            // Lakukan seleksi untuk mendapatkan parent
            let matingPool = this.selection(population, fitnessScores);

            // Crossover - Generate new population
            let newPopulation = [];
            for (let i = 0; i < population.length-1; i+=2){
                let parent1 = matingPool[i];
                let parent2 = matingPool[i + 1];
                let child = this.crossover(parent1, parent2);
                newPopulation.push(child[0]);
                newPopulation.push(child[1]);
            }
            // kalo ada parent yang gaada pasangan, dijadiin generasi baru
            if (matingPool.length % 2 !== 0) {
                newPopulation.push(matingPool[matingPool.length - 1]);
            }

            // Mutation 
            let mutationRate = 0.1;
            newPopulation = newPopulation.map(individual => 
                Math.random() < mutationRate ? this.mutate(individual) : individual
            );

            population = newPopulation;
            this.iterasi++;
        }while (this.iterasi < maxIterations);

        // Return best solution found
        let finalFitnessScores = population.map(cubeState => this.calculateFitness(cubeState));
        let bestFinalIndex = finalFitnessScores.indexOf(Math.min(...finalFitnessScores));
        this.cube = population[bestFinalIndex];
        return this.cube;
    }

    initializePopulation(size) {
        // Create an array of random cube states
        const population = [];
        for (let i = 0; i < size; i++) {
            let cubeCopy = this.cube;
            cubeCopy = this.randomizeCube(cubeCopy);
            population.push(cubeCopy);
        }
        return population;
    }

    calculateFitness(cubeState) {
        const originalCube = this.cube;
        this.cube = cubeState;
        const fitness = this.objectiveFunction();
        this.cube = originalCube;
        return fitness;
    }

    selection(population,fitnessValues) {
        // Seleksi menggunakan random wheel

        const totalFitness = fitnessValues.reduce((sum, fitness) => sum + fitness, 0);
        const cumulativeProbabilities = [];
        
        // Calculate cumulative probabilities
        let cumulativeSum = 0;
        for (let i = 0; i < fitnessValues.length; i++) {
            cumulativeSum += fitnessValues[i] / totalFitness;
            cumulativeProbabilities[i] = cumulativeSum;
        }
        const matingPool = [];
        for (let i = 0; i < population.length; i++){
            // Spin the wheel 
            const randomValue = Math.random();
            // Find the individual where cumulative probability is just greater than randomValue
            for (let i = 0; i < population.length; i++) {
                if (randomValue <= cumulativeProbabilities[i]) {
                    matingPool.push(population[i]);
                }
            }
        }
        return matingPool;
    }

    crossover(parent1, parent2) {
        const child1 = parent1;
        const child2 = parent2;
        const crossoverPoint = Math.floor(Math.random() * 5);

        for (let i = crossoverPoint; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                for (let k = 0; k < 5; k++) {
                    child1[i][j][k] = parent2[i][j][k];
                    child2[i][j][k] = parent1[i][j][k];
                }
            }
        }
        return [child1, child2];
    }

    mutate(cubeState) {
        // Swap two random elements in the cube
        let i1 = Math.floor(Math.random() * 5);
        let j1 = Math.floor(Math.random() * 5);
        let k1 = Math.floor(Math.random() * 5);
        let i2 = Math.floor(Math.random() * 5);
        let j2 = Math.floor(Math.random() * 5);
        let k2 = Math.floor(Math.random() * 5);

        [cubeState[i1][j1][k1], cubeState[i2][j2][k2]] = [cubeState[i2][j2][k2], cubeState[i1][j1][k1]];
        return cubeState;
    }

    randomizeCube(cubeState) {
        while (true) {
            // tukar 2 angka
            let i = Math.floor(Math.random() * 5);
            let j = Math.floor(Math.random() * 5);
            let k = Math.floor(Math.random() * 5);
    
            let x = Math.floor(Math.random() * 5);
            let y = Math.floor(Math.random() * 5);
            let z = Math.floor(Math.random() * 5);
            if (i !== x || j !== y || k !== z) {
                [cubeState[i][j][k], cubeState[x][y][z]] = [cubeState[x][y][z], cubeState[i][j][k]];
                return cubeState;
            }
        }
        return cubeState;
    }

    getH(){
        return this.h;
    }
    getObjective() {
        return this.objectiveFunction();
    }
    getMagicNumber() {
        return this.magicNumber;
    }
    getIterasi() {
        return this.iterasi;
    }
    getHValues(step = 0) {
        return this.hValues.filter((_, index) => index % step === 0);
    }
    getEValues(step = 0){
        return this.e_values.filter((_, index) => index % step === 0);
    }
    getStuckFreq(){
        return this.stuck_freq;
    }
    getSeqElement(){
        return this.sequensElement;
    }
}
export function solveStochasticHC(req,res){
    const { cubeState } = req.body;
    if (!cubeState || !Array.isArray(cubeState)) {
        return res.status(400).json({
            success: false,
            message: "Invalid cube state provided"
        });
    }
    const magicCube = new Cube(cubeState.length, cubeState);
    const objFuncBefore = magicCube.getObjective();

    const startTime = Date.now();
    const solvedCube = magicCube.stochasticHillClimbing();
    const endTime = Date.now();
    const executionTime = endTime - startTime;

    const objFuncAfter = magicCube.getObjective();
    const magicnum = magicCube.getMagicNumber();
    const iter = magicCube.getIterasi();
    const sequensElement = magicCube.getSeqElement();

    const hValues = magicCube.getHValues(1);
    res.json({
        message: "Kubus berhasil diselesaikan",
        algoritma: "Stochastic Hill Climb",
        n_iter: iter,
        solvedCube,
        h_before: objFuncBefore,
        h_after: objFuncAfter,
        magic_number: magicnum,
        h_values: hValues,
        execution_time: executionTime,
        seq_elemen: sequensElement
    });


}
export function solveSteepHC(req, res) {
    const { cubeState } = req.body;

    if (!cubeState || !Array.isArray(cubeState)) {
        return res.status(400).json({
            success: false,
            message: "Invalid cube state provided"
        });
    }

    const magicCube = new Cube(cubeState.length, cubeState);
    const objFuncBefore = magicCube.getObjective();

    const startTime = Date.now();
    const solvedCube = magicCube.steepestAscentHillClimbing();
    const endTime = Date.now();
    const executionTime = endTime - startTime;

    const objFuncAfter = magicCube.getObjective();
    const magicnum = magicCube.getMagicNumber();
    const iter = magicCube.getIterasi();
    const sequensElement = magicCube.getSeqElement();

    const hValues = magicCube.getHValues(1);  //ambil tiap 100 iterasi, kalo semua ngelag


    res.json({
        message: "Kubus berhasil diselesaikan",
        algoritma: "Steepest Hill Climb",
        n_iter: iter,
        solvedCube,
        h_before: objFuncBefore,
        h_after: objFuncAfter,
        magic_number: magicnum,
        h_values: hValues,
        execution_time: executionTime,
        seq_elemen: sequensElement
    });
}




export function solveSimulatedAnnealing(req, res) {
    const { cubeState } = req.body;

    if (!cubeState || !Array.isArray(cubeState)) {
        return res.status(400).json({
            success: false,
            message: "Invalid cube state provided"
        });
    }

    const magicCube = new Cube(cubeState.length, cubeState);
    const objFuncBefore = magicCube.getObjective();

    const startTime = Date.now();
    const solvedCube = magicCube.simulatedAnnealing();
    const endTime = Date.now();

    const executionTime = endTime - startTime;

    const objFunctAfter = magicCube.getObjective();
    const magicnum = magicCube.getMagicNumber();
    const hValues = magicCube.getHValues(25);  //ambil tiap 25 iterasi, kalo semua ngelag

    const iter = magicCube.getIterasi();
    const e_values = magicCube.getEValues(25);
    const stuck_freq = magicCube.getStuckFreq();
    const sequensElement = magicCube.getSeqElement();

    res.json({
        message: "Kubus berhasil diselesaikan",
        algoritma: "Simulated Annealing",
        n_iter: iter,
        solvedCube,
        h_before: objFuncBefore,
        h_after: objFunctAfter,
        magic_number: magicnum,
        h_values: hValues,
        execution_time: executionTime,
        e_values : e_values,
        stuck_freq : stuck_freq,
        seq_elemen: sequensElement
    });
}

export function solveRandomRestartHC(req, res) {
    const { cubeState,maxRestarts } = req.body;

    if (!cubeState || !Array.isArray(cubeState)) {
        return res.status(400).json({
            success: false,
            message: "Invalid cube state provided"
        });
    }
    const magicCube = new Cube(cubeState.length, cubeState);
    const objFuncBefore = magicCube.getObjective();

    const startTime = Date.now();
    const solvedCube = magicCube.randomRestartHillClimbing(maxRestarts);
    const endTime = Date.now();
    const executionTime = endTime - startTime;

    const objFuncAfter = magicCube.getObjective();
    const magicnum = magicCube.getMagicNumber();
    const iter = magicCube.getIterasi();
    const sequensElement = magicCube.getSeqElement();


    const hValues = magicCube.getHValues(1);
    const iterValues = Array.from({ length: hValues.length }, (_, i) => i + 1); 

    res.json({
        message: "Cube successfully solved",
        algoritma: "Random Restart Hill Climb",
        n_iter: iter,
        solvedCube,
        h_before: objFuncBefore,
        h_after: objFuncAfter,
        magic_number: magicnum,
        h_values: hValues,
        execution_time: executionTime,
        seq_element: sequensElement,
        iter_values: iterValues 
    });
}

export function solveSidewaysHC(req, res) {
    const { cubeState,maxsidewaysMove  } = req.body;

    if (!cubeState || !Array.isArray(cubeState)) {
        return res.status(400).json({
            success: false,
            message: "Invalid cube state provided"
        });
    }

    const magicCube = new Cube(cubeState.length, cubeState);
    const objFuncBefore = magicCube.getObjective();

    const startTime = Date.now();
    console.log ("start sideways");
    const solvedCube = magicCube.sidewaysmoveHillClimbing(maxsidewaysMove);
    const endTime = Date.now();
    const executionTime = endTime - startTime;

    const objFuncAfter = magicCube.getObjective();
    const magicnum = magicCube.getMagicNumber();
    const iter = magicCube.getIterasi();
    const sequensElement = magicCube.getSeqElement();

    const hValues = magicCube.getHValues(1);  


    res.json({
        message: "Kubus berhasil diselesaikan",
        algoritma: "Sideways Hill Climb",
        n_iter: iter,
        solvedCube,
        h_before: objFuncBefore,
        h_after: objFuncAfter,
        magic_number: magicnum,
        h_values: hValues,
        execution_time: executionTime,
        seq_elemen: sequensElement
    });
}

export function solveGeneticAlgorithm(req, res) {
    const { cubeState, jumlahIterasi, banyakPopulasi } = req.body;

    if (!cubeState || !Array.isArray(cubeState)) {
        return res.status(400).json({
            success: false,
            message: "Invalid cube state provided"
        });
    }

    const magicCube = new Cube(cubeState.length, cubeState);
    const objFuncBefore = magicCube.getObjective();

    const startTime = Date.now();
    const solvedCube = magicCube.geneticAlgorithm(banyakPopulasi,jumlahIterasi);
    const endTime = Date.now();
    const executionTime = endTime - startTime;

    const objFuncAfter = magicCube.getObjective();
    const magicnum = magicCube.getMagicNumber();
    const iter = magicCube.getIterasi();
    const sequensElement = magicCube.getSeqElement();

    const hValues = magicCube.getHValues(1);  //ambil tiap 100 iterasi, kalo semua ngelag


    res.json({
        message: "Kubus berhasil diselesaikan",
        algoritma: "Genetic Algorithm",
        n_iter: iter,
        solvedCube,
        h_before: objFuncBefore,
        h_after: objFuncAfter,
        magic_number: magicnum,
        h_values: hValues,
        execution_time: executionTime,
        seq_elemen: sequensElement
    });
}