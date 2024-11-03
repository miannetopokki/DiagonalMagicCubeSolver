class MagicCube {
    constructor() {
        /* Global */
        this.scene = null;
        this.camera = null;
        this.renderer = null;

        this.replayscene = null;
        this.replaycamera = null;
        this.replayrenderer = null;

        this.solvedScene = null;
        this.solvedCamera = null;
        this.solvedRenderer = null;

        this.controls = null;
        this.solvedControls = null;
        this.replaycontrols = null;



        this.isSolved = false;
        this.cubeState = [];
        this.solvedCubeState = [];
        this.lastRenderTime = 0;
        this.space = 1;
        this.nsize = 5;
        this.x_offset = 1;
        this.y_offset = 1;
        this.z_offset = 1;
        this.nonDeletableObjects = [];
        this.animationProgress = 0;

        this.startPosition = new THREE.Vector3(1000, 1000, 1000);
        this.targetPosition = new THREE.Vector3(5, 5, 12);

        this.sequensElement = [];
        this.replayDurasi = 1000;
        this.speedUpDurasi = this.replayDurasi;
        this.nsequence = 0;
        this.cubePositions = {}; // Initialize an object to track cube positions
        this.isReplayed = false;
        this.hValues = null;
        this.avghvalues = null;

        this.initializeReplayCubeScene();
        this.initializeScene();
        this.initializeSolvedCubeScene();

    }
    plotObjectiveFunction(hValues) {
        this.hValues = hValues;
        const ctx = document.getElementById('objectiveFunctionChart').getContext('2d');

        // Jika chart sudah ada, hancurkan terlebih dahulu
        if (this.objectiveFunctionChart) {
            this.objectiveFunctionChart.destroy();
        }

        // Buat chart baru dan simpan referensinya di 'this.objectiveFunctionChart'
        this.objectiveFunctionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({ length: hValues.length }, (_, i) => i + 1),
                datasets: [{
                    label: 'Objective Function (h) per 100 Iteration',
                    data: hValues,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: { display: true, text: 'Iteration' },
                        grid: { color: 'rgba(255, 255, 255, 0.2)' },
                        ticks: { color: '#ffffff' }
                    },
                    y: {
                        title: { display: true, text: 'Objective Function (h)' },
                        grid: { color: 'rgba(255, 255, 255, 0.2)' },
                        ticks: { color: '#ffffff' }
                    }
                }
            }
        });
    }
    plotAVGObjectiveFunction(hValues) {
        this.avghvalues = hValues;
        const ctx = document.getElementById('avgobjectiveFunctionChart').getContext('2d');

        // Jika chart sudah ada, hancurkan terlebih dahulu
        if (this.avgobjectiveFunctionChart) {
            this.avgobjectiveFunctionChart.destroy();
        }

        // Buat chart baru dan simpan referensinya di 'this.avgobjectiveFunctionChart'
        this.avgobjectiveFunctionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({ length: hValues.length }, (_, i) => i + 1),
                datasets: [{
                    label: 'Average Objective Function (h) per 100 Iteration',
                    data: hValues,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: { display: true, text: 'Iteration' },
                        grid: { color: 'rgba(255, 255, 255, 0.2)' },
                        ticks: { color: '#ffffff' }
                    },
                    y: {
                        title: { display: true, text: 'Average Objective Function (h)' },
                        grid: { color: 'rgba(255, 255, 255, 0.2)' },
                        ticks: { color: '#ffffff' }
                    }
                }
            }
        });
    }


    initializeScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.copy(this.targetPosition);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth / 1.35, window.innerHeight / 1.35);
        document.getElementById('cubeContainer').appendChild(this.renderer.domElement);



        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        this.nonDeletableObjects.push(ambientLight);
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.cubeState = this.generateInitialState(this.nsize);

        this.visualizeCube(this.cubeState, this.scene, this.controls);
        this.visualizeCube(this.cubeState, this.replayscene, this.replaycontrols);

        this.createParticles(this.scene);
        this.animate();
        console.log("Non delete Object : ", this.nonDeletableObjects);
    }
    initializeSolvedCubeScene() {
        this.solvedScene = new THREE.Scene();
        this.solvedScene.background = new THREE.Color(0x000000);
        this.solvedCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.solvedRenderer = new THREE.WebGLRenderer();
        this.solvedRenderer.setSize(window.innerWidth / 1.35, window.innerHeight / 1.35);
        document.getElementById('solvedCubeContainer').appendChild(this.solvedRenderer.domElement);
        this.isSolved = false;
        this.solvedCamera.position.copy(this.targetPosition);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.solvedScene.add(ambientLight);
        this.createParticles(this.solvedScene);
        this.solvedControls = new THREE.OrbitControls(this.solvedCamera, this.solvedRenderer.domElement);
    }
    initializeReplayCubeScene() {
        this.replayscene = new THREE.Scene();
        this.replayscene.background = new THREE.Color(0x000000);
        this.replaycamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.replayrenderer = new THREE.WebGLRenderer();
        this.replayrenderer.setSize(window.innerWidth / 1.35, window.innerHeight / 1.35);
        document.getElementById('replayCubeContainer').appendChild(this.replayrenderer.domElement);
        this.replaycamera.position.copy(this.targetPosition);
        this.replaycontrols = new THREE.OrbitControls(this.replaycamera, this.replayrenderer.domElement);


        this.createParticles(this.replayscene);


    }
    addGrid() {
        const gridHelper = this.nonDeletableObjects.find(obj => obj.name === 'gridHelper');
        if (gridHelper) {
            this.scene.remove(gridHelper);
            this.nonDeletableObjects = this.nonDeletableObjects.filter(obj => obj.name !== 'gridHelper');
        } else {
            const newGridHelper = new THREE.GridHelper(30, 30);
            newGridHelper.name = 'gridHelper';
            this.scene.add(newGridHelper);
            this.nonDeletableObjects.push(newGridHelper);
        }
        console.log("Non Deleteable :", this.nonDeletableObjects);

    }

    addAxis() {
        const axesHelper = this.nonDeletableObjects.find(obj => obj.name === 'axesHelper');
        if (axesHelper) {
            this.scene.remove(axesHelper);
            this.nonDeletableObjects = this.nonDeletableObjects.filter(obj => obj.name !== 'axesHelper');
        } else {
            const newAxesHelper = new THREE.AxesHelper(20);
            newAxesHelper.name = 'axesHelper';
            this.scene.add(newAxesHelper);
            this.nonDeletableObjects.push(newAxesHelper);
        }
        console.log("Non Deleteable :", this.nonDeletableObjects);
    }




    animate() {
        const now = performance.now();
        if (now - this.lastRenderTime >= 8) {
            this.renderer.render(this.scene, this.camera);

            if (this.replayrenderer) {
                this.replayrenderer.render(this.replayscene, this.replaycamera);
            }

            if (this.controls) this.controls.update();
            if (this.replaycontrols) this.replaycontrols.update();

            if (this.solvedRenderer) {
                this.solvedControls.update();
                this.solvedRenderer.render(this.solvedScene, this.solvedCamera);
            }

            this.lastRenderTime = now;
        }
        requestAnimationFrame(this.animate.bind(this));
    }

    animateCubeMovement() {
        return new Promise((resolve) => {  
            let isAnimating = false;
            const progressBar = document.getElementById('progressBar');
            const angka1 = document.getElementById('angka1');
            const angka2 = document.getElementById('angka2');
            const currenth = document.getElementById('hvalue');


            const totalSequences = this.sequensElement.length;
            let completedAnim = 0;
            console.log("Sedang replay");
            

            //kalo udah pernah replay sebelumnya
            if(this.isReplayed){
                console.log("udah pernah replayed, refresh ke cube awal");
                this.visualizeCube(this.cubeState,this.replayscene,this.replaycontrols);
            }


            this.sequensElement.forEach((sequence, index) => {
                setTimeout(() => {
                    if (isAnimating) return;
                    isAnimating = true;

                    const nilai1 = sequence[2][0];
                    const nilai2 = sequence[2][1];
                    const hval = sequence[3] * (-1);
                    const cube1Key = `${nilai1}`;
                    const cube2Key = `${nilai2}`;

                    angka1.innerText = nilai1;
                    angka2.innerText = nilai2;
                    currenth.innerText = hval;
                  



                    const cube1 = this.replayscene.getObjectByName(cube1Key);
                    const cube2 = this.replayscene.getObjectByName(cube2Key);

                    if (cube1 && cube2) {
                        const originalPosition1 = cube1.position.clone();
                        const originalPosition2 = cube2.position.clone();

                        cube1.material.color.set(0xff0000);
                        cube2.material.color.set(0x0000ff);

                        const duration = this.speedUpDurasi / 5;
                        const startTime = performance.now();

                        const animate = (currentTime) => {
                            const elapsedTime = currentTime - startTime;
                            const t = Math.min(elapsedTime / duration, 1); 

                            cube1.position.lerpVectors(originalPosition1, originalPosition2, t);
                            cube2.position.lerpVectors(originalPosition2, originalPosition1, t);

                            const progressPercentage = ((index + t) / totalSequences) * 100; 
                            progressBar.style.width = progressPercentage + '%'; 
                            progressBar.textContent = completedAnim  + '/' + totalSequences; 

                            if (t < 1) {
                                requestAnimationFrame(animate);
                            } else {
                                cube1.material.color.set(new THREE.Color(255 / 255, 192 / 255, 203 / 255));
                                cube2.material.color.set(new THREE.Color(255 / 255, 192 / 255, 203 / 255));

                                [this.cubePositions[cube1Key], this.cubePositions[cube2Key]] = [this.cubePositions[cube2Key], this.cubePositions[cube1Key]];
                                completedAnim++;
                                console.log(completedAnim);

                                isAnimating = false;
                                if (completedAnim === totalSequences) {
                                    this.isReplayed = true;
                                    console.log("Beres replay");
                                    progressBar.textContent = completedAnim  + '/' + totalSequences; 

                                    resolve();

                                }
                            }
                        };
                        requestAnimationFrame(animate);
                    } else {
                        console.warn(`Cubes not found for keys: ${cube1Key} or ${cube2Key}`);
                        isAnimating = false;
                        return;
                    }
                }, index * this.speedUpDurasi);
            });
        });
    }

    animateCamera(targetControl, targetCamera, targetRenderer, targetScene) {
        if (this.animationProgress < 1) {
            targetCamera.position.lerpVectors(this.startPosition, this.targetPosition, this.animationProgress);
            this.animationProgress += 0.05;

            if (this.animationProgress >= 1) {
                targetCamera.position.copy(this.targetPosition);
                this.setCenterPivotControl(targetControl, targetCamera, targetRenderer);
                this.animationProgress = 1;
            }

            targetRenderer.render(targetScene, targetCamera);
            requestAnimationFrame(() => this.animateCamera(targetControl, targetCamera, targetRenderer, targetScene));
        }
    }

    setCenterPivotControl(targetControl, targetCamera, targetRenderer) {
        targetControl = new THREE.OrbitControls(targetCamera, targetRenderer.domElement);
        const center = this.nsize / 2;
        targetControl.target.set(center * this.space, center * this.space, center * this.space);
        targetControl.update();
    }

    generateInitialState(n) {
        const totalNumbers = n * n * n;
        const numbers = Array.from({ length: totalNumbers }, (_, i) => i + 1);

        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }

        let index = 0;
        for (let i = 0; i < n; i++) {
            const layer = [];
            for (let j = 0; j < n; j++) {
                const row = [];
                for (let k = 0; k < n; k++) {
                    row.push(numbers[index++]);
                }
                layer.push(row);
            }
            this.cubeState.push(layer);
        }
        console.log(this.cubeState);
        return this.cubeState;
    }

    createParticles(targetScene) {
        const particleCount = 300;
        const particlesGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const x = (Math.random() - 0.5) * 1000;
            const y = (Math.random() - 0.5) * 1000;
            const z = (Math.random() - 0.5) * 1000;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 2,
        });

        const particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
        particleSystem.name = 'particleSystem';
        this.nonDeletableObjects.push(particleSystem);
        targetScene.add(particleSystem);
    }

    visualizeCube(cubeState, targetScene, targetControl) {
        this.createCube(cubeState, targetScene, targetControl);
        this.animate();
    }

    createCube(cubeState, targetScene, targetcontrol) {
        this.clearScene(targetScene);
        const size = cubeState.length;
        const center = size / 2;

        // Iterasi setiap layer dalam cubeState
        cubeState.forEach((layerState, layerIndex) => {
            layerState.forEach((row, i) => {
                row.forEach((cubeNumber, j) => {
                    // Buat setiap balok dan atur posisinya secara langsung
                    const cube = this.createTransparentCube(cubeNumber);
                    const positionKey = `${cubeNumber}`; // Key unik untuk balok
                    cube.name = positionKey;

                    // Simpan posisi balok tanpa layer grouping
                    this.cubePositions[positionKey] = { x: j, y: i, z: layerIndex };

                    // Atur posisi setiap balok berdasarkan x, y, dan z
                    cube.position.set(
                        this.x_offset * j * this.space,
                        this.y_offset * i * this.space,
                        this.z_offset * layerIndex
                    );

                    // Tambahkan balok langsung ke targetScene
                    targetScene.add(cube);
                });
            });
        });

        // Set OrbitControls pivot pada pusat cube
        targetcontrol.target.set(
            this.x_offset * center * this.space,
            this.y_offset * center * this.space,
            this.z_offset * center * this.space
        );
        console.log("Pivot : ", center * this.space);
    }

    createTransparentCube(number) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(255 / 255, 192 / 255, 203 / 255),
            transparent: true,
            opacity: 0.5,
            depthTest: false,
        });

        const cube = new THREE.Mesh(geometry, material);
        const numberSprite = this.createNumberSprite(number);
        numberSprite.position.set(0, 0, 0);
        cube.add(numberSprite);

        return cube;
    }




    createTransparentCube(number) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(255 / 255, 192 / 255, 203 / 255),
            transparent: true,
            opacity: 0.5,
            depthTest: false,
        });

        const cube = new THREE.Mesh(geometry, material);
        const numberSprite = this.createNumberSprite(number);
        numberSprite.position.set(0, 0, 0);
        cube.add(numberSprite);

        return cube;
    }
    changeYSpace(isAdd) {
        if (isAdd) {
            this.y_offset += 1;
        } else {
            if (this.y_offset <= 1) {
                this.y_offset = 1;

            } else {
                this.y_offset -= 1;
            }
        }
        if (this.isSolved) {
            this.visualizeCube(this.solvedCubeState, this.solvedScene, this.solvedControls);

        }
        this.visualizeCube(this.cubeState, this.scene, this.controls);
        if(this.isReplayed){
            this.visualizeCube(this.solvedCubeState, this.replayscene, this.replaycontrols);
        }else{
            this.visualizeCube(this.cubeState, this.replayscene, this.replaycontrols);
        }

    }
    changeZSpace(isAdd) {
        if (isAdd) {
            this.z_offset += 1;
        } else {
            if (this.z_offset <= 0) {
                this.z_offset = 0;

            } else {
                this.z_offset -= 1;
            }
        }
        if (this.isSolved) {
            this.visualizeCube(this.solvedCubeState, this.solvedScene, this.solvedControls);

        }
        
        this.visualizeCube(this.cubeState, this.scene, this.controls);
        if(this.isReplayed){
            this.visualizeCube(this.solvedCubeState, this.replayscene, this.replaycontrols);
        }else{
            this.visualizeCube(this.cubeState, this.replayscene, this.replaycontrols);
        }


    }
    changeXSpace(isAdd) {
        if (isAdd) {
            this.x_offset += 1;
        } else {
            if (this.x_offset <= 1) {
                this.x_offset = 1;

            } else {
                this.x_offset -= 1;
            }
        }
        if (this.isSolved) {
            this.visualizeCube(this.solvedCubeState, this.solvedScene, this.solvedControls);

        }
        this.visualizeCube(this.cubeState, this.scene, this.controls);
        if(this.isReplayed){
            this.visualizeCube(this.solvedCubeState, this.replayscene, this.replaycontrols);
        }else{
            this.visualizeCube(this.cubeState, this.replayscene, this.replaycontrols);
        }
    }

    createNumberSprite(number) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 256;

        context.fillStyle = 'rgba(255, 192, 203, 0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'black';
        context.font = 'bold 150px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(number, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true });

        const sprite = new THREE.Sprite(material);
        sprite.scale.set(1, 1, 1);
        return sprite;
    }

    clearScene(targetScene) {
        for (let i = targetScene.children.length - 1; i >= 0; i--) {
            const object = targetScene.children[i];
            if (this.nonDeletableObjects.includes(object)) {
                continue;
            }
            targetScene.remove(object);
        }
    }
    getIsAnimating() {
        return this.isAnimating;
    }
}

export { MagicCube };


