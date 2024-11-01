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
                } else if(Math.exp(diffH/Tvalue)>0.5){
                    currentH = newH;
                    this.stuck_freq++;
                }else{
                    [this.cube[i][j][k], this.cube[x][y][z]] = [this.cube[x][y][z], this.cube[i][j][k]];
                }
                this.iterasi++;
                this.hValues.push(newH);
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
    const iter_values = [];
    for(let i =1; i<= iter; i++){
        iter_values.push(i);
    }

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
        iter_values : iter_values,
        stuck_freq : stuck_freq,
    });
}
