let scene, camera, renderer;
let solvedScene, solvedCamera, solvedRenderer;
let controls, solvedControls;
let isSolved;
let cubeState = [];
let solvedCubeState = [];
function generateInitialState(n) {
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
        cubeState.push(layer);
    }
    console.log("Initiate Cube = ", cubeState);
    return cubeState;
}
function createParticles(targetScene) {
    const particleCount = 300;

    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3); // 3 coordinates per particle

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
        size: 5,
    });

    const particleSystem = new THREE.Points(particlesGeometry, particleMaterial);

    particleSystem.name = 'particleSystem'; //identifier
    targetScene.add(particleSystem);
}





function initializeScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth / 2.5, window.innerHeight / 1.5);
    document.getElementById('cubeContainer').appendChild(renderer.domElement);

    camera.position.z = 12;
    camera.position.y = 5;
    camera.position.x = 5;


    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(ambientLight);
    scene.add(axesHelper);
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    const n = 5;
    cubeState = generateInitialState(n);
    visualizeCube(cubeState);
    createParticles(scene);

}

function initializeSolvedCubeScene() {
    solvedScene = new THREE.Scene();
    solvedScene.background = new THREE.Color(0x000000)
    solvedCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    solvedRenderer = new THREE.WebGLRenderer();
    solvedRenderer.setSize(window.innerWidth / 2.5, window.innerHeight / 1.5);
    document.getElementById('solvedCubeContainer').appendChild(solvedRenderer.domElement);
    isSolved = false;

    solvedCamera.position.z = 12;
    solvedCamera.position.y = 5;
    solvedCamera.position.x = 5;



    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    solvedScene.add(ambientLight);
    createParticles(solvedScene);
    solvedControls = new THREE.OrbitControls(solvedCamera, solvedRenderer.domElement);
    console.log("Solved Renderer initialized:", solvedRenderer);
}

let space = 1;
function createLayer(layerState, layerIndex, size, isSolvedCube = false) {
    const layerGroup = new THREE.Group();

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cube = createTransparentCube(layerState[i][j]);
            cube.position.set(j * space, i * space, layerIndex);
            layerGroup.add(cube);
        }
    }

    layerGroup.position.z = layerIndex * space;
    return layerGroup;
}

function setCubeSpacing(newSpacing) {
    space = newSpacing;
    if (isSolved) {
        visualizeCube(solvedCubeState, true);
    }
    visualizeCube(cubeState);

}

function handleGenerateCube() {
    const n = 5;
    cubeState = [];
    cubeState = generateInitialState(n);
    visualizeCube(cubeState);
}

// document.getElementById('generateCubeButton').addEventListener('click', handleGenerateCube);
document.getElementById('increaseSpacingButton').addEventListener('click', () => {
    setCubeSpacing(space + 0.2);
});

document.getElementById('decreaseSpacingButton').addEventListener('click', () => {
    setCubeSpacing(space - 0.2);
});







let font; 
function loadFont(callback) {
    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (loadedFont) => {
        font = loadedFont;
        callback();
    });
}
function createTransparentCube(number) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(255 / 255, 192 / 255, 203 / 255),
        transparent: true,
        opacity: 0.5,
        depthTest: false
    });

    const cube = new THREE.Mesh(geometry, material);

    const numberSprite = createNumberSprite(number);
    numberSprite.position.set(0,0,0);
    cube.add(numberSprite);

    // const numberMesh = createNumberMesh(number);
    // numberMesh.position.set(0, 0, 0);
    // cube.add(numberMesh);

    // const textMesh = createNumberMeshGeometry(number);
    // cube.add(textMesh);

    return cube;
}


/* Bagian representasi angka*/

function createNumberSprite(number) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 256;

    context.fillStyle = 'rgba(255, 192, 203, 0.5)'; // Background color
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'black';
    context.font = 'bold 150px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(number, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(1, 1, 1); // Adjust size as needed
    return sprite;
}
function createNumberMeshGeometry(number) {
    const textGeometry = new THREE.TextGeometry(number.toString(), {
        font: font, // Use the loaded font
        size: 0.35, // Adjust size as needed
        height: 0.05, // Adjust height as needed
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.02,
        bevelSegments: 5
    });

    const textMaterial = new THREE.MeshBasicMaterial({ color: 'black' });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    // Center the text
    textGeometry.computeBoundingBox();
    const centerOffset = -0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
    textMesh.position.set(centerOffset, 0, 0); // Center it on the cube

    return textMesh;
}
function createNumberMesh(number) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 100;
    canvas.height = 100;

    context.fillStyle = 'pink';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'black';
    context.font = '50px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(number, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geometry, material);

    return mesh;
}






function createCube(cubeState, isSolvedCube = false) {
    const targetScene = isSolvedCube ? solvedScene : scene;
    const targetControl = isSolvedCube ? solvedControls : controls;

    
    clearScene(targetScene)

    const size = cubeState.length;
    const center = (size) / 2
    console.log(center);

    for (let i = 0; i < size; i++) {
        const layer = createLayer(cubeState[i], i, size, isSolvedCube);
        targetScene.add(layer);
    }
    targetControl.target.set(center * space, center * space, center * space);
}

let lastRenderTime = 0;
function animate() {
    const now = performance.now();
    if (now - lastRenderTime >= 8) {  //batas fps
        renderer.render(scene, camera);
        if (solvedRenderer) {
            solvedControls.update();
            solvedRenderer.render(solvedScene, solvedCamera);
        }
        lastRenderTime = now;
    }
    requestAnimationFrame(animate);
}



export function visualizeCube(cubeState, isSolvedCube = false) {
    createCube(cubeState, isSolvedCube);
    animate();
}
export function solveCube(cubeState) {
    fetch('/api/solve', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cubeState })
    })
        .then(response => response.json())
        .then(result => {
            console.log('Hasil solusi dari server:', result);
            const { solvedCube, h_before, h_after, algoritma, n_iter } = result;
            solvedCubeState = solvedCube;
            visualizeCube(solvedCubeState, true);

            document.getElementById('hBeforeValue').innerText = h_before;
            document.getElementById('hAfterValue').innerText = h_after;
            document.getElementById('algoritma').innerText = algoritma;
            document.getElementById('iterasi').innerText = n_iter;

        })
        .catch(error => {
            console.error('Error:', error);
        });
}

document.getElementById('solveCubeButton').addEventListener('click', () => {
    solveCube(cubeState);
    isSolved = true;

});

function disposeObject(object) {
    if (object.geometry) object.geometry.dispose();
    if (object.material) {
        if (object.material.map) object.material.map.dispose();
        object.material.dispose();
    }
}

function clearScene(targetScene) {
    for (let i = targetScene.children.length - 1; i >= 0; i--) {
        const object = targetScene.children[i];
        if (object.name !== 'particleSystem') {  
            disposeObject(object);
            targetScene.remove(object);
        }
    }
}


window.onload = () => {
    loadFont(() => {
        initializeScene();
        initializeSolvedCubeScene();
        animate();
    });
};
