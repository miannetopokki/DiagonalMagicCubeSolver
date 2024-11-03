class Cube {
    constructor(size, cubeState) {
        this.n = size;
        this.magicNumber = (this.n * (Math.pow(this.n, 3) + 1)) / 2;
        this.cube = cubeState;
        this.h = 0;
        this.iterasi = 0;
        this.hValues = [];
        this.sequensElement = [];
        this.hValues = []; 
        this.e_values = [];
        this.stuck_freq = 0;
    }

    objectiveFunction() {
        this.h = 0;
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
        for (let j = 0; j < this.n; j++) {
            for (let k = 0; k < this.n; k++) {
                let pillarSum = 0;
                for (let i = 0; i < this.n; i++) {
                    pillarSum += this.cube[i][j][k];
                }
                this.h += Math.abs(pillarSum - this.magicNumber);
            }
        }

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
                                            this.sequensElement.push([[i, j, k], [x, y, z], [this.cube[x][y][z], this.cube[i][j][k]]]);
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
        const maxIterations = 12000;

        do {
            improved = false;
            console.log(this.iterasi);
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
                if (newH < currentH) {
                    currentH = newH;
                } else {
                    [this.cube[i][j][k], this.cube[x][y][z]] = [this.cube[x][y][z], this.cube[i][j][k]];

                }
                this.iterasi++;
            }
        } while (this.iterasi < maxIterations);
        return this.cube;
    }
    simulatedAnnealing() {
        let currentH = this.objectiveFunction();
        let Tvalue = 1000;
        const coolingRate = 0.95;
        const maxIterations = 50000;
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
                    this.sequensElement.push([[i, j, k], [x, y, z], [this.cube[x][y][z], this.cube[i][j][k]]]);
                } else if(Math.exp(diffH/Tvalue)>0.5){
                    currentH = newH;
                    this.sequensElement.push([[i, j, k], [x, y, z], [this.cube[x][y][z], this.cube[i][j][k]]]);
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
        } while (this.iterasi < maxIterations);
        return this.cube;
    }

    randomRestartHillClimbing() {
        const maxRestart = 100;
        let best_h = this.getObjective(); // Start with the current h
        let best_cube = this.cube; // Start with the current cube
        
        console.log("Initial Best H: ", best_h);
    
        for (let i = 0; i < maxRestart; i++) {
            console.log(this.n);
            const newCube = new Cube(this.n, this.generateMagicCubeState(this.n));
            
            // console.log("Generated Cube: ", newCube.cube);
    
            newCube.steepestAscentHillClimbing();
            
            let currentH = newCube.getH();
            this.hValues.push(currentH);
            console.log(`Iteration ${i}: Current H = ${currentH}, Best H = ${best_h}`);
            
            if (currentH < best_h) {
                best_h = currentH;
                best_cube = newCube.cube; // Copy the best cube found
                console.log("New Best Found: ", best_h);
            }
        }
        
        this.cube = best_cube; // Set the best cube found
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

    sidewaysmoveHillClimbing() {
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
                                        // Swap elements
                                        [this.cube[i][j][k], this.cube[x][y][z]] = [this.cube[x][y][z], this.cube[i][j][k]];
    
                                        let newH = this.objectiveFunction();
                                
                                        
                                        // If newH is better, accept the change
                                        if (newH < currentH) {
                                            currentH = newH;
                                            improved = true;
                                          
                                            this.sequensElement.push([[i, j, k], [x, y, z], [this.cube[x][y][z], this.cube[i][j][k]]]);
                                            this.hValues.push(currentH * (-1));
                                            this.iterasi++;
                                        } else if (newH === currentH) { 
                                                currentH = newH;
                                                this.sequensElement.push([[i, j, k], [x, y, z], [this.cube[x][y][z], this.cube[i][j][k]]]);
                                                this.hValues.push(currentH * (-1));
                                                this.iterasi++;
                                        } else { 
                                            [this.cube[i][j][k], this.cube[x][y][z]] = [this.cube[x][y][z], this.cube[i][j][k]];
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
    getEValues(){
        return this.e_values;
    }
    getStuckFreq(){
        return this.stuck_freq;
    }
    getSeqElement(){
        return this.sequensElement;
    }
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
    const hValues = magicCube.getHValues(100);  //ambil tiap 100 iterasi, kalo semua ngelag

    const iter = magicCube.getIterasi();
    const e_values = magicCube.getEValues();
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
    const solvedCube = magicCube.randomRestartHillClimbing();
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
        algorithm: "Random Restart Hill Climb",
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
    console.log ("start sideways");
    const solvedCube = magicCube.sidewaysmoveHillClimbing();
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