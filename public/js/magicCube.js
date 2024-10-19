let scene, camera, renderer;
let solvedScene,solvedCamera,solvedRenderer;
let cubeState = [];
const cubeSimpan = [];
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



let controls, solvedControls;
function initializeScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth / 2.5, window.innerHeight / 2);
    document.getElementById('cubeContainer').appendChild(renderer.domElement);

    camera.position.z = 12;
    camera.position.y = 5;
    camera.position.x = 5;


    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    const n = 5; 
    cubeState = generateInitialState(n);
    visualizeCube(cubeState);
}

function initializeSolvedCubeScene() {
    solvedScene = new THREE.Scene();
    solvedCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    solvedRenderer = new THREE.WebGLRenderer();
    solvedRenderer.setSize(window.innerWidth / 2.5, window.innerHeight / 2);
    document.getElementById('solvedCubeContainer').appendChild(solvedRenderer.domElement);

    solvedCamera.position.z = 12;
    solvedCamera.position.y = 5;
    solvedCamera.position.x = 5;

  

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    solvedScene.add(ambientLight);
    solvedControls = new THREE.OrbitControls(solvedCamera, solvedRenderer.domElement); 
    console.log("Solved Renderer initialized:", solvedRenderer); 
}

let space = 1.1;
function createLayer(layerState, layerIndex, size,isSolvedCube=false) {
    const layerGroup = new THREE.Group();

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cube = createTransparentCube(layerState[i][j]);
            cube.position.set(j * space, i * space, layerIndex); 
            layerGroup.add(cube);
            cubeSimpan.push(cube);
        }
    }

    layerGroup.position.z = layerIndex;
    return layerGroup;
}

function setCubeSpacing(newSpacing) {
    space = newSpacing; 
    const size = Math.cbrt(cubeSimpan.length); 

    for (let index = 0; index < cubeSimpan.length; index++) {
        const layerIndex = Math.floor(index / (size * size));
        const rowIndex = Math.floor((index % (size * size)) / size);
        const colIndex = index % size;

        cubeSimpan[index].position.set(colIndex * space, rowIndex * space, layerIndex);
    }
}

function handleGenerateCube() {
    const n = 5; 
    cubeState = [];
    cubeState = generateInitialState(n);
    visualizeCube(cubeState);
}

document.getElementById('generateCubeButton').addEventListener('click', handleGenerateCube);
document.getElementById('increaseSpacingButton').addEventListener('click', () => {
    setCubeSpacing(space + 0.2);
});

document.getElementById('decreaseSpacingButton').addEventListener('click', () => {
    setCubeSpacing(space - 0.2); 
});

function createTransparentCube(number) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.1 }); 
    const cube = new THREE.Mesh(geometry, material);

    const numberMesh = createNumberMesh(number);
    numberMesh.position.set(0, 0, 0.51); 
    cube.add(numberMesh);

    return cube;
}

function createNumberMesh(number) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 100; 
    canvas.height = 100; 

    context.fillStyle = 'grey';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
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

function createCube(cubeState,isSolvedCube = false) {
    const targetScene = isSolvedCube ? solvedScene : scene; 
   
    while (targetScene.children.length > 0) {
        targetScene.remove(targetScene.children[0]);
    }

    const size = cubeState.length;

    for (let i = 0; i < size; i++) {
        const layer = createLayer(cubeState[i], i, size,isSolvedCube);
        targetScene.add(layer);
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    renderer.render(scene, camera);
    if (solvedRenderer) {
        solvedControls.update(); 
        solvedRenderer.render(solvedScene, solvedCamera); 
    }
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
        const { solvedCube, h_before, h_after,algoritma,n_iter} = result;
        visualizeCube(solvedCube, true); 
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
    
});

window.onload = () => {
    initializeScene();
    initializeSolvedCubeScene();
    animate(); 
    
};