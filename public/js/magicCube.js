class MagicCube {
    constructor() {
        /* Global */
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.solvedScene = null;
        this.solvedCamera = null;
        this.solvedRenderer = null;
        this.controls = null;
        this.solvedControls = null;
        this.isSolved = false;
        this.cubeState = [];
        this.solvedCubeState = [];
        this.lastRenderTime = 0;
        this.space = 1;
        this.nsize = 5;
        this.x_offset = 1;
        this.y_offset = 1;
        this.z_offset = 0;
        this.nonDeletableObjects =  [];
        this.animationProgress = 0;
        this.startPosition = new THREE.Vector3(1000, 1000, 1000);
        this.targetPosition = new THREE.Vector3(5, 5, 12);
        
        this.initializeScene();
        this.initializeSolvedCubeScene();
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

        this.visualizeCube(this.cubeState);
        this.createParticles(this.scene);
        this.animate();
        console.log("Non delete Object : " , this.nonDeletableObjects);
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
        console.log("Non Deleteable :" ,  this.nonDeletableObjects);

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
        console.log("Non Deleteable :" ,  this.nonDeletableObjects);
    }
    

    initializeSolvedCubeScene() {
        this.solvedScene = new THREE.Scene();
        this.solvedScene.background = new THREE.Color(0x000000);
        this.solvedCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.solvedRenderer = new THREE.WebGLRenderer();
        this.solvedRenderer.setSize(window.innerWidth / 1.35, window.innerHeight / 1.35);
        document.getElementById('solvedCubeContainer').appendChild(this.solvedRenderer.domElement);
        this.isSolved = false;
        this.solvedCamera.position.copy(this.startPosition);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.solvedScene.add(ambientLight);
        this.createParticles(this.solvedScene);
        this.solvedControls = new THREE.OrbitControls(this.solvedCamera, this.solvedRenderer.domElement);
    }

    animate() {
        const now = performance.now();
        if (now - this.lastRenderTime >= 8) {
            this.renderer.render(this.scene, this.camera);
            this.controls.update();

            if (this.solvedRenderer) {
                this.solvedControls.update();
                this.solvedRenderer.render(this.solvedScene, this.solvedCamera);
            }
            this.lastRenderTime = now;
        }
        requestAnimationFrame(this.animate.bind(this));
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

    visualizeCube(cubeState, isSolvedCube = false) {
        this.createCube(cubeState, isSolvedCube);
        this.animate();
    }

    createCube(cubeState, isSolvedCube = false) {
        const targetScene = isSolvedCube ? this.solvedScene : this.scene;
        this.clearScene(targetScene);
        const size = cubeState.length;
        const center = size / 2;
    
        // Gunakan delay untuk menambahkan setiap layer satu per satu
        cubeState.forEach((layerState, layerIndex) => {
            setTimeout(() => {
                const layer = this.createLayer(layerState, layerIndex, size, isSolvedCube);
                targetScene.add(layer);
                console.log("Layer " , layerIndex, ": " , layer.position);
            }, layerIndex * 25); // 500 ms delay antara setiap layer; sesuaikan sesuai kebutuhan
        });
    
        // Buat OrbitControls
        if (isSolvedCube) {
            this.solvedControls.target.set(this.x_offset *center * this.space, this.y_offset *center * this.space, (this.z_offset) + center * this.space);
        }
        this.controls.target.set(this.x_offset * center * this.space, this.y_offset *center * this.space, (this.z_offset) + center * this.space);
        console.log("Pivot : ", center * this.space);
    }
    

    createLayer(layerState, layerIndex, size, isSolvedCube = false) {
        const layerGroup = new THREE.Group();
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cube = this.createTransparentCube(layerState[i][j]);
                cube.position.set((this.x_offset*j * this.space ), ( this.y_offset*i * this.space), this.z_offset * layerIndex);
                layerGroup.add(cube);
            }
        }
        layerGroup.position.z = (layerIndex)-0.5  ;
        layerGroup.position.y = 0.5;
        layerGroup.position.x = 0.5;
        return layerGroup;
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
    setCubeSpacing(newSpacing) {
        this.space = newSpacing;
        if (this.isSolved) {
            this.visualizeCube(this.solvedCubeState, true);
        }
        this.visualizeCube(this.cubeState);
    
    }
    changeYSpace(isAdd) {
        if(isAdd){
            this.y_offset += 1;
        }else{
            if(this.y_offset <= 1){
                this.y_offset = 1;

            }else{
                this.y_offset -= 1;
            }
        }
        if (this.isSolved) {
            this.visualizeCube(this.solvedCubeState, true);
        }
        this.visualizeCube(this.cubeState);
        
    }
    changeZSpace(isAdd) {
        if(isAdd){
            this.z_offset += 1;
        }else{
            if(this.z_offset <= 0){
                this.z_offset = 0;

            }else{
                this.z_offset -= 1;
            }
        }
        if (this.isSolved) {
            this.visualizeCube(this.solvedCubeState, true);
        }
        this.visualizeCube(this.cubeState);
        
    }
    changeXSpace(isAdd) {
        if(isAdd){
            this.x_offset += 1;
        }else{
            if(this.x_offset <= 1){
                this.x_offset = 1;

            }else{
                this.x_offset -= 1;
            }
        }
        if (this.isSolved) {
            this.visualizeCube(this.solvedCubeState, true);
        }
        this.visualizeCube(this.cubeState); 
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
}

export { MagicCube };


